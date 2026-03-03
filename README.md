# Investment Assistant

An Android investment assistant application.

## Getting Started

### Prerequisites

- Android Studio (latest stable)
- JDK 8 or higher

### Clone and Open

```bash
git clone https://github.com/rahulsharmafca199-cyber/https-github.com-rahulsharmafca199-cyber-investmentassistant.git
```

Open the cloned folder in Android Studio.

## Setting Up Release Signing (Fix for Unsigned AAB)

When you clone this repository, release builds will be **unsigned** unless you configure a keystore. Follow these steps to enable signed release AAB/APK builds:

### Step 1: Generate a Keystore (skip if you already have one)

Using the command line:
```bash
keytool -genkey -v -keystore release.keystore -alias investment_assistant \
  -keyalg RSA -keysize 2048 -validity 10000
```

Or in Android Studio:
> **Build → Generate Signed Bundle / APK → Create new…**

### Step 2: Create `keystore.properties`

Copy the example file to the **project root** directory:

```bash
cp keystore.properties.example keystore.properties
```

Then edit `keystore.properties` and fill in your actual values:

```properties
storeFile=../release.keystore
storePassword=your_keystore_password
keyAlias=investment_assistant
keyPassword=your_key_password
```

> ⚠️ **Important:** `keystore.properties` and `*.keystore` / `*.jks` files are listed in `.gitignore` and must **never** be committed to version control.

### Step 3: Build a Signed Release AAB

In Android Studio:
> **Build → Generate Signed Bundle / APK → Android App Bundle**

Or via the command line:
```bash
./gradlew bundleRelease
```

The signed AAB will be output to:
```
app/build/outputs/bundle/release/app-release.aab
```

## Debug Builds

Debug builds are always signed automatically with Android's default debug keystore — no extra setup is needed for development or testing.
