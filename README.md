# Investment Assistant

A compound interest calculator Android app that helps users plan their investments.

## Features
- Calculate compound interest returns
- Shows total maturity amount and profit earned
- Clean Material Design UI

## CI/CD — Signed AAB Build

This repository includes a GitHub Actions workflow that automatically builds a **signed Release AAB** on every push to `main`/`master`.

### Required GitHub Secrets

To enable AAB signing you must add the following secrets to your repository  
(**Settings → Secrets and variables → Actions → New repository secret**):

| Secret name       | Description |
|-------------------|-------------|
| `KEYSTORE_BASE64` | Your Android keystore file encoded as Base64 (see below) |
| `STORE_PASSWORD`  | Password for the keystore file |
| `KEY_ALIAS`       | Alias of the signing key inside the keystore |
| `KEY_PASSWORD`    | Password for the signing key |

#### Generating a Keystore (first-time setup)

```bash
keytool -genkey -v \
  -keystore release.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### Encoding the Keystore to Base64

**Linux / macOS:**
```bash
base64 -i release.keystore | tr -d '\n'
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))
```

Copy the output and paste it as the value of the `KEYSTORE_BASE64` secret.

### Workflow Output

After a successful run the signed `.aab` file is available as a workflow artifact named  
**`investment-assistant-release-aab`** and is retained for 30 days.

## Local Build

### Prerequisites
- JDK 17
- Android SDK (API 34)

### Build debug APK
```bash
./gradlew assembleDebug
```

### Build release AAB (unsigned)
```bash
./gradlew bundleRelease
```

### Build signed release AAB locally

Set the environment variables before running Gradle:

```bash
export KEYSTORE_PATH=/path/to/release.keystore
export STORE_PASSWORD=your_store_password
export KEY_ALIAS=your_key_alias
export KEY_PASSWORD=your_key_password

./gradlew bundleRelease
```

The signed AAB will be located at `app/build/outputs/bundle/release/app-release.aab`.

## Project Structure

```
InvestmentAssistant/
├── .github/
│   └── workflows/
│       └── build-release-aab.yml   # CI/CD workflow for signed AAB
├── app/
│   ├── build.gradle                # App dependencies & signing config
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/investmentassistant/
│       │   └── MainActivity.java
│       └── res/
│           ├── layout/activity_main.xml
│           └── values/
│               ├── colors.xml
│               ├── strings.xml
│               └── themes.xml
├── build.gradle
├── gradle.properties
└── settings.gradle
```
