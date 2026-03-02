# Investment Assistant

An investment assistant application.

---

## Keystore Generation

A keystore is required to sign the application for distribution. **Never commit a keystore file (or its password) to version control.** The `.gitignore` in this repository already excludes `*.jks`, `*.keystore`, `*.p12`, and `*.pfx` files.

### Option 1 — Download via GitHub Actions (recommended)

1. Open the **Actions** tab in this repository.
2. Select the **"Generate Keystore"** workflow from the left sidebar.
3. Click **"Run workflow"**, fill in the optional parameters, then click the green **"Run workflow"** button.
4. Wait for the run to complete (usually under 1 minute).
5. Open the completed run and scroll to the **Artifacts** section at the bottom.
6. Click **`investment-assistant-keystore`** to download a ZIP containing `investment-assistant.jks`.

> **Password:** Set the `KEYSTORE_PASSWORD` repository secret before running the workflow
> (*Settings → Secrets and variables → Actions → New repository secret*).
> If the secret is not set, a random password is generated and printed in the workflow log — copy it immediately, as it will not be shown again.
>
> **Retention:** The artifact is available for **7 days**. Download and store it securely.

### Option 2 — Generate locally

Requirements: any JDK (provides `keytool`).

```bash
bash scripts/generate-keystore.sh
```

The script accepts optional flags. Run `bash scripts/generate-keystore.sh -h` for full usage.

Example with custom options:
```bash
bash scripts/generate-keystore.sh \
  -o my-release.jks \
  -a my-key-alias \
  -p MySecurePassword123 \
  -n "My App" \
  -g "My Organization" \
  -c IN
```

> ⚠️ **Security reminders**
> - Store the keystore file and its password in a secure location (e.g. a password manager).
> - If you lose the keystore you will be unable to publish updates to the app store.
> - Do **not** share the keystore or its password publicly.
