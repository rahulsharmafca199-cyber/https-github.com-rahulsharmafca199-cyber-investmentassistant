# https-github.com-rahulsharmafca199-cyber-investmentassistant
Investment Assistant

## Android Release Signing Setup

To set up automated release signing in GitHub Actions, encode your keystore file to base64 and add it as a repository secret.

### 1. Encode the keystore

Run the following command to encode `investiq-release.keystore` to base64 and save it to `keystore.txt`:

```bash
base64 -i investiq-release.keystore -o keystore.txt
```

> On Linux, use: `base64 investiq-release.keystore > keystore.txt`

### 2. Add GitHub repository secrets

Go to **Settings → Secrets and variables → Actions** and add the following secrets:

| Secret name        | Value                                          |
|--------------------|------------------------------------------------|
| `KEYSTORE_BASE64`  | Contents of `keystore.txt` (the base64 string) |
| `KEY_ALIAS`        | Your key alias                                 |
| `KEY_PASSWORD`     | Your key password                              |
| `STORE_PASSWORD`   | Your keystore password                         |

> **Important:** Never commit `investiq-release.keystore` or `keystore.txt` to the repository. Add them to `.gitignore`.

### 3. Trigger a release build

Push to the `main` branch or manually trigger the **Android Release Build** workflow from the Actions tab.
