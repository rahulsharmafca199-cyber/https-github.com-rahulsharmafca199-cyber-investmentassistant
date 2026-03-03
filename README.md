# Investment Assistant (InvestmentIQ)

An Android app that helps users make informed investment decisions.

---

## Finding the Signed AAB in a Downloaded App Bundle

After the **Build & Release Signed APK/AAB** workflow completes successfully, the signed
Android App Bundle (`.aab`) is available as a GitHub Actions artifact called
**`signed-release-aab`**.

### Step-by-step: download the signed AAB

1. Open the repository on GitHub and click the **Actions** tab.
2. In the list on the left, select **Build & Release Signed APK/AAB**.
3. Click the most recent successful workflow run (green checkmark ✅).
4. Scroll to the **Artifacts** section at the bottom of the run summary page.
5. Click **`signed-release-aab`** — a ZIP file downloads automatically.
6. Unzip the downloaded file.  
   **The `.aab` file is at the top level of the ZIP**, for example:
   ```
   signed-release-aab.zip
   └── InvestmentIQ-<version>.aab   ← your signed AAB is right here
   ```
7. Upload `InvestmentIQ-<version>.aab` to the
   [Google Play Console](https://play.google.com/console) to publish your app.

> **Tip:** A signed APK (for direct device installation) is available in the
> separate **`signed-release-apk`** artifact in the same workflow run.

---

## Setting Up Signed Builds (one-time setup)

Signing is required to publish to the Google Play Store and to install a release
build on a device.

### Step 1 — Create a keystore

If you already have a `.jks` keystore file, skip to Step 2.

```bash
keytool -genkeypair -v \
  -keystore app/my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

You will be prompted for a keystore password, key password, and your
organisation details.  The file is written to `app/my-release-key.jks`.

> **Keep this file backed up securely.**  
> It is listed in `.gitignore` and will **never** be committed to the repository.

### Step 2 — Create `keystore.properties` (local builds only)

```bash
cp keystore.properties.template keystore.properties
```

Edit `keystore.properties` and fill in your values:

```properties
storeFile=app/my-release-key.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

### Step 3 — Add secrets to GitHub (CI builds)

Go to **Settings → Secrets and variables → Actions → New repository secret**
and add the four secrets below.

| Secret name | Value |
|-------------|-------|
| `KEYSTORE_BASE64` | Base64-encoded keystore (see below) |
| `KEYSTORE_PASSWORD` | Your keystore password |
| `KEY_ALIAS` | Your key alias |
| `KEY_PASSWORD` | Your key password |

**How to base64-encode the keystore:**

```bash
# macOS
base64 -i app/my-release-key.jks | pbcopy   # copies to clipboard

# Linux
base64 -w 0 app/my-release-key.jks          # prints to terminal — copy and paste

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("app\my-release-key.jks")) | Set-Clipboard
```

Paste the result as the value of the `KEYSTORE_BASE64` secret.

---

## Building Locally

### Signed release APK

```bash
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

### Signed release AAB (for Play Store)

```bash
./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`

---

## Automated Builds via GitHub Actions

The workflow at `.github/workflows/build-release.yml` builds and signs the
APK and AAB automatically — without storing any secrets in the repository.

### When does the workflow run?

| Trigger | Behaviour |
|---------|-----------|
| Push a tag (`v*`) | Builds signed APK + AAB, creates a GitHub Release |
| Pull request to `main` / `master` | Builds signed APK + AAB, uploads as artifacts |
| Manual (**Actions → Run workflow**) | Same as above; optionally create a Release |

### Where are the signed files after the workflow runs?

| Artifact name | Contents |
|---------------|----------|
| `signed-release-aab` | `InvestmentIQ-<version>.aab` — upload to Google Play Store |
| `signed-release-apk` | `InvestmentIQ-<version>.apk` — install directly on Android devices |

Both artifacts are ZIP files.  After downloading and unzipping,
**the `.aab` / `.apk` file is at the top level** of the extracted folder.

---

## Project Structure

```
InvestmentIQ/
├── app/
│   ├── build.gradle            # Module Gradle build script (signing config)
│   ├── proguard-rules.pro
│   └── src/
├── .github/
│   └── workflows/
│       └── build-release.yml   # GitHub Actions CI/CD workflow
├── .gitignore                  # Excludes keystore.properties and *.jks
├── build.gradle                # Root Gradle build script
├── keystore.properties.template
├── settings.gradle
└── README.md
```

> **Never commit** `keystore.properties` or any `.jks` / `.keystore` file.
