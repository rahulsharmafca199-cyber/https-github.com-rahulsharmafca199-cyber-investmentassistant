# Investment Assistant

An Android app that helps users calculate investment returns using compound interest.

## Features

- Compound Interest Calculator
- Clean Material Design UI
- Supports investments in Indian Rupees (₹)

## Building the App

### Prerequisites
- JDK 17 or higher
- Android SDK with API level 35

### Build Release AAB (App Bundle)

```bash
./gradlew bundleRelease
```

The AAB will be generated at: `app/build/outputs/bundle/release/app-release.aab`

### Build Debug APK

```bash
./gradlew assembleDebug
```

## Setting Up Signing for Google Play Store

To upload a signed AAB to the Google Play Store, you need to configure signing.

### Step 1: Generate a Keystore

```bash
keytool -genkey -v \
  -keystore release.jks \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Investment Assistant, OU=Mobile, O=YourOrg, L=City, S=State, C=IN"
```

### Step 2: Add GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret Name | Value |
|---|---|
| `KEYSTORE_BASE64` | Base64 encoded keystore: `base64 -i release.jks` |
| `KEYSTORE_PASSWORD` | Password used when generating the keystore |
| `KEY_ALIAS` | Key alias (e.g., `release`) |
| `KEY_PASSWORD` | Key password |
| `SERVICE_ACCOUNT_JSON` | Google Play Service Account JSON (for automatic publishing) |

### Step 3: Trigger a Build

Push to the `main` branch or create a tag (e.g., `v1.0.0`) to trigger an automated build.

The signed AAB will be available as a GitHub Actions artifact and can be downloaded and uploaded to the Google Play Store.

## CI/CD

The GitHub Actions workflow (`.github/workflows/build-release.yml`) automatically:
1. Builds the release AAB on every push to `main`/`master`
2. Signs the AAB using your keystore (if secrets are configured)
3. Uploads to Google Play Store internal track when a version tag is pushed

## Minimum Requirements

- Android 5.0 (API level 21) and higher
- Target SDK: Android 15 (API level 35)
