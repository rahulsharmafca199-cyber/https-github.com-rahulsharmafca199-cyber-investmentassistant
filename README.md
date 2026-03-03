# Investment Assistant

An Android investment assistant application built with Kotlin.

## Building the App

### Prerequisites
- Android Studio (latest stable version)
- JDK 17
- An Android signing keystore (required for Play Store uploads)

---

## 🔑 Generating a Release Keystore

If you don't already have a keystore, generate one with:

```bash
keytool -genkey -v \
  -keystore release-keystore.jks \
  -alias investment-assistant \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

> ⚠️ **IMPORTANT**: Keep your keystore file and passwords safe. If you lose them, you cannot update your app on the Play Store.

---

## 🔧 Local Signing Setup

1. Copy the example keystore properties file:
   ```bash
   cp keystore.properties.example keystore.properties
   ```

2. Edit `keystore.properties` with your keystore details:
   ```properties
   storeFile=../release-keystore.jks
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyAlias=YOUR_KEY_ALIAS
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. Build the signed release APK:
   ```bash
   ./gradlew assembleRelease
   ```

4. Build the signed release AAB (required for Play Store):
   ```bash
   ./gradlew bundleRelease
   ```

The signed outputs will be in:
- **APK**: `app/build/outputs/apk/release/app-release.apk`
- **AAB**: `app/build/outputs/bundle/release/app-release.aab`

---

## 🚀 GitHub Actions CI/CD (Automated Play Store Upload)

The `.github/workflows/android.yml` workflow automatically builds and optionally uploads to the Play Store.

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret Name | Description |
|---|---|
| `KEYSTORE_BASE64` | Base64-encoded content of your `.jks` keystore file |
| `KEY_STORE_PASSWORD` | Password for the keystore (mapped to `KEYSTORE_PASSWORD` in workflow) |
| `KEY_ALIAS` | Alias of the signing key |
| `KEY_PASSWORD` | Password for the key alias |
| `SERVICE_ACCOUNT_JSON` | Google Play service account JSON (for auto-upload) |

### Encoding Your Keystore as Base64

**Linux/macOS:**
```bash
base64 -i release-keystore.jks | tr -d '\n'
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release-keystore.jks"))
```

Paste the output as the value of the `KEYSTORE_BASE64` secret.

### Setting Up Google Play Service Account (for auto-upload)

1. Go to [Google Play Console](https://play.google.com/console)
2. Navigate to **Setup → API access**
3. Link to a Google Cloud project
4. Create a **Service Account** with the role **Release Manager**
5. Download the JSON key file
6. Paste the **entire JSON content** as the `SERVICE_ACCOUNT_JSON` secret

### Triggering the Workflow

- **On every push to `main`/`master`**: Builds a signed APK and AAB, uploads as GitHub artifacts
- **On a version tag push** (e.g., `git tag v1.0.0 && git push origin v1.0.0`): Additionally uploads the AAB to the **internal track** of Google Play

---

## 📱 Play Store Upload Checklist

Before uploading to the Play Store, ensure:

- [ ] App is signed with your **release keystore** (not debug)
- [ ] `applicationId` in `app/build.gradle` matches your Play Console package name
- [ ] `versionCode` is incremented for each new upload
- [ ] `versionName` is updated appropriately
- [ ] **AAB format** is used (Play Store requires AAB for new apps since August 2021)
- [ ] `targetSdk` is at the required minimum level (currently 34+)
- [ ] All required **Play Store listing assets** are uploaded (screenshots, icon, description)

---

## Common Play Store Upload Errors and Fixes

| Error | Fix |
|---|---|
| `You uploaded an APK or Android App Bundle that was signed in debug mode` | Use `assembleRelease` / `bundleRelease` with signing config |
| `Upload failed, the package name does not match` | Ensure `applicationId` in `build.gradle` matches your Play Console app |
| `Version code already used` | Increment `versionCode` in `app/build.gradle` |
| `App not signed with the correct key` | Use the same keystore registered with Play Store |
| `Target API level requirement` | Set `targetSdk 34` or higher in `app/build.gradle` |
| `APK instead of AAB` | Use `bundleRelease` to generate `.aab` files |
