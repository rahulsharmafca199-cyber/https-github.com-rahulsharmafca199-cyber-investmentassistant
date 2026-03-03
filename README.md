# Investment Assistant

An Android app for tracking and managing investments.

## Build Configuration

- **compileSdk**: 35
- **targetSdk**: 35 (required by Google Play Store)
- **minSdk**: 26 (Android 8.0 Oreo)

## Setting Up Release Signing

### Local Builds

1. Generate a keystore (if you don't have one):
   ```bash
   keytool -genkeypair -v -keystore release-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias your-key-alias
   ```
   You will be prompted to enter and confirm the keystore password, key password, and your identity details.
2. Copy `keystore.properties.example` to `keystore.properties`:
   ```bash
   cp keystore.properties.example keystore.properties
   ```
3. Fill in your actual values in `keystore.properties`.

### GitHub Actions (CI/CD)

Add these repository secrets:

| Secret | Description |
|---|---|
| `KEYSTORE_BASE64` | Base64-encoded keystore: `base64 -i release-keystore.jks` |
| `KEY_STORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |
| `SERVICE_ACCOUNT_JSON` | Google Play service account JSON (for Play Store uploads) |

## Building

```bash
# Debug build
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Release AAB (for Play Store)
./gradlew bundleRelease
```

## Play Store Upload

The CI/CD workflow automatically uploads the AAB to the **internal track** on the Play Store when you push a `v*` tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Common Play Store Upload Errors & Fixes

| Error | Fix |
|---|---|
| Target SDK too low | Set `targetSdk 35` in `app/build.gradle` |
| APK not signed / signature mismatch | Ensure signing config is set for the `release` build type |
| Version code already used | Increment `versionCode` in `app/build.gradle` |
| Package name mismatch | Ensure `applicationId` matches your Play Console app |
| Missing `android:exported` | Add `android:exported="true"` to activities with intent filters |
