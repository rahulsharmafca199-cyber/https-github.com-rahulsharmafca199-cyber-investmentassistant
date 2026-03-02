# Keystore Setup Guide

This document explains how to generate a release keystore and configure the project to sign release builds for Google Play Store submission.

---

## Prerequisites

- Java Development Kit (JDK) 8 or newer installed (`keytool` is bundled with JDK)
- Android Studio or the Android SDK command-line tools

---

## Step 1 – Create a keystore directory (outside the repo)

Keep the keystore **outside** the repository to avoid accidental commits.

```bash
mkdir -p ~/keystores
```

---

## Step 2 – Generate a release keystore

```bash
keytool -genkey -v \
  -keystore ~/keystores/investment-assistant-release.jks \
  -alias investment-assistant \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted for:
- **Keystore password** – choose a strong password and save it securely
- **Key password** – can be the same as, or different from, the keystore password
- **Distinguished-name fields** – name, organisation, city, country, etc.

> ⚠️ **Back up the keystore file and passwords securely** (e.g. a password manager).  
> If you lose them, you will **never** be able to publish updates to the same Play Store listing.

---

## Step 3 – Create your local gradle.properties

Copy the template and fill in your own values:

```bash
cp gradle.properties.template gradle.properties
```

Edit `gradle.properties` with the correct paths and passwords:

```properties
RELEASE_STORE_FILE=/home/<your-user>/keystores/investment-assistant-release.jks
RELEASE_STORE_PASSWORD=<your_keystore_password>
RELEASE_KEY_ALIAS=investment-assistant
RELEASE_KEY_PASSWORD=<your_key_password>
```

`gradle.properties` is listed in `.gitignore` – it will **never** be committed.

---

## Step 4 – Build a signed release AAB

```bash
./gradlew bundleRelease
```

The signed bundle will be written to:

```
app/build/outputs/bundle/release/app-release.aab
```

To build a signed APK instead:

```bash
./gradlew assembleRelease
```

---

## Step 5 – Verify the signature

```bash
jarsigner -verify -verbose -certs \
  app/build/outputs/bundle/release/app-release.aab
```

---

## GitHub Actions / CI

The repository includes a GitHub Actions workflow (`.github/workflows/release.yml`) that builds a signed AAB automatically on every push to the `release` branch.

You must add the following **repository secrets** in *Settings → Secrets and variables → Actions*:

| Secret name              | Description                                              |
|--------------------------|----------------------------------------------------------|
| `RELEASE_KEYSTORE_BASE64`| Base64-encoded keystore file                             |
| `RELEASE_STORE_PASSWORD` | Keystore password                                        |
| `RELEASE_KEY_ALIAS`      | Key alias                                                |
| `RELEASE_KEY_PASSWORD`   | Key password                                             |

To encode the keystore:

```bash
base64 -i ~/keystores/investment-assistant-release.jks | pbcopy   # macOS
base64 ~/keystores/investment-assistant-release.jks               # Linux (copy output)
```

Paste the output as the value of the `RELEASE_KEYSTORE_BASE64` secret.

---

## Security Best Practices

- ✅ The keystore and `gradle.properties` are excluded from version control via `.gitignore`
- ✅ Passwords are never hard-coded in `build.gradle`
- ✅ CI uses encrypted repository secrets — secrets are not exposed in logs
- ✅ Keep a secure backup of the keystore and passwords outside the repository
- ⛔ Never share the keystore file or passwords in issues, pull requests, or chat
