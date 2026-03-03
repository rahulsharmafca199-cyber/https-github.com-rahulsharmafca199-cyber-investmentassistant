# https-github.com-rahulsharmafca199-cyber-investmentassistant
Investment Assistant

## GitHub Actions – Release Signing Setup

The Android Release Build workflow (`.github/workflows/android-release.yml`) signs the APK using a keystore stored as a base64-encoded repository secret.

### Required repository secrets

Go to **Settings → Secrets and variables → Actions** and add the following secrets:

| Secret name        | Description                                      |
|--------------------|--------------------------------------------------|
| `KEYSTORE_BASE64`  | Contents of `keystore.txt` (base64-encoded keystore) |
| `KEYSTORE_PASSWORD`| Keystore password                                |
| `KEY_ALIAS`        | Key alias (e.g. `investiq`)                      |
| `KEY_PASSWORD`     | Key password                                     |

### Encoding the keystore

To generate `keystore.txt` from your keystore file, run:

```bash
# macOS
base64 -i investiq-release.keystore -o keystore.txt

# Linux
base64 investiq-release.keystore > keystore.txt
```

Paste the full contents of `keystore.txt` as the value of the `KEYSTORE_BASE64` secret.

> **Important:** Never commit `investiq-release.keystore` or `keystore.txt` to the repository.
