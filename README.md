# InvestmentIQ — Investment Assistant

An Android app that helps users make informed investment decisions.

---

## Generating a Signed APK / AAB

Signing is required to publish to the Google Play Store and to install a release build on a device.

### Step 1 — Create a keystore (one-time setup)

If you have already run `keytool` and created a `.jks` file, skip to Step 2.

Open a terminal and run the following command from the **project root**:

```bash
keytool -genkeypair -v \
  -keystore app/my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

You will be prompted to enter:

| Prompt | What to provide |
|--------|-----------------|
| Keystore password | Choose a strong password and remember it |
| Re-enter password | Same password |
| First and last name | Your name or company name |
| Organizational unit / Organization / City / State / Country | Your details |
| Key password | Can be the same as the keystore password |

The file `app/my-release-key.jks` will be created inside the `app/` folder.

> **Keep this file safe and backed up.**  
> It is listed in `.gitignore` and will **not** be committed to version control.

---

### Step 2 — Create `keystore.properties`

Copy the committed template to a **new file** called `keystore.properties` in the project root:

```bash
cp keystore.properties.template keystore.properties
```

Open `keystore.properties` and fill in your values:

```properties
storeFile=app/my-release-key.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

> `keystore.properties` is listed in `.gitignore`.  
> Your passwords will **never** be committed to the repository.

---

### Step 3 — Build locally

#### Signed release APK

```bash
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

#### Signed release AAB (for Play Store)

```bash
./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`

---

## Automated Signed Builds via GitHub Actions

The workflow at `.github/workflows/build-release.yml` builds and signs the APK/AAB automatically in GitHub Actions — without storing any secrets in the repository.

### One-time setup — add secrets to GitHub

1. Go to **Settings → Secrets and variables → Actions → New repository secret** in your repository.
2. Add the following four secrets:

| Secret name | Value |
|-------------|-------|
| `KEYSTORE_BASE64` | Your keystore file encoded in base64 (see below) |
| `KEYSTORE_PASSWORD` | Your keystore password (`storePassword`) |
| `KEY_ALIAS` | Your key alias (`keyAlias`) |
| `KEY_PASSWORD` | Your key password (`keyPassword`) |

#### How to base64-encode your keystore

**macOS / Linux**

```bash
base64 -i app/my-release-key.jks | pbcopy   # macOS — copied to clipboard
base64 app/my-release-key.jks               # Linux  — print to terminal, then copy
```

**Windows (Git Bash)**

```bash
base64 app/my-release-key.jks | clip
```

**Windows (PowerShell)**

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("app\my-release-key.jks")) | Set-Clipboard
```

Paste the output as the value of the `KEYSTORE_BASE64` secret.

### When does the workflow run?

| Trigger | Behaviour |
|---------|-----------|
| Push to `main` / `master` | Builds a signed APK and AAB |
| New tag (`v*`) | Same as above |
| Pull request to `main` / `master` | Same as above |
| Manual (Actions tab → **Run workflow**) | Same as above |

The signed artifacts are available on the **Actions** tab under the completed workflow run as downloadable ZIP files:

- `signed-release-apk` — contains `app-release.apk`
- `signed-release-aab` — contains `app-release.aab`

---

## Project structure

```
InvestmentIQ/
├── app/
│   ├── build.gradle            # Module Gradle build script (includes signing config)
│   ├── proguard-rules.pro      # ProGuard rules for release builds
│   └── src/
├── .github/
│   └── workflows/
│       └── build-release.yml   # GitHub Actions CI/CD workflow
├── .gitignore                  # Excludes keystore.properties and *.jks
├── build.gradle                # Root Gradle build script
├── keystore.properties.template # Safe template — commit this, NOT keystore.properties
├── settings.gradle
└── README.md
```

> **Never commit** `keystore.properties` or any `.jks` / `.keystore` file.  
> Both are in `.gitignore` to protect your signing credentials.
