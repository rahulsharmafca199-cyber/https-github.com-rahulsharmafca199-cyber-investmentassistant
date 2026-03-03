# Investment Assistant

An Android app that helps users calculate investment returns using compound interest.

## Features

- Compound Interest Calculator
- Clean Material Design UI
- Supports investments in Indian Rupees (₹)

## Building the App

### Prerequisites
- JDK 17 or higher
- Android SDK with API level 34

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

To upload a signed AAB to the Google Play Store, you **must** configure app signing. Google Play Store requires a properly signed AAB.

### Step 1: Generate a Keystore

Run this command once and keep your keystore file safe:

```bash
keytool -genkey -v \
  -keystore release.jks \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Investment Assistant, OU=Mobile, O=YourOrg, L=City, S=State, C=IN"
```

### Step 2: Encode the Keystore as Base64

```bash
base64 -i release.jks | tr -d '\n'
```

### Step 3: Add GitHub Secrets

Go to **GitHub → Settings → Secrets and variables → Actions** and add:

| Secret Name | Value |
|---|---|
| `KEYSTORE_BASE64` | The base64-encoded keystore from Step 2 |
| `KEYSTORE_PASSWORD` | The store password set in Step 1 |
| `KEY_ALIAS` | The key alias (e.g., `release`) |
| `KEY_PASSWORD` | The key password set in Step 1 |
| `SERVICE_ACCOUNT_JSON` | Google Play Service Account JSON (for automatic publishing only) |

### Step 4: Trigger a Build

Push to the `main` branch or manually trigger the **Android Build & Sign** workflow from the Actions tab.

The signed AAB will be available as a GitHub Actions artifact named `investment-assistant-release-aab`.

### Step 5: Upload to Google Play Store

1. Download the `app-release.aab` artifact from GitHub Actions
2. Go to Google Play Console → Your App → Release → Production (or Internal testing)
3. Click **Create new release**
4. Upload the `.aab` file
5. Complete the release details and publish

## CI/CD

The GitHub Actions workflow (`.github/workflows/build-release.yml`) automatically:
1. Builds the release AAB on every push to `main`/`master`
2. Signs the AAB using your keystore (secrets must be configured)
3. Uploads to Google Play Store internal track when a version tag (e.g., `v1.0.0`) is pushed

## App Details

- **Package Name**: `com.rahulsharmafca199.investmentassistant`
- **Minimum SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 14 (API 34)
- **Version Code**: 1
- **Version Name**: 1.0.0
