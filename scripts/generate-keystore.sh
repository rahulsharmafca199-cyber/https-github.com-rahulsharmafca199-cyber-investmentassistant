#!/usr/bin/env bash
# generate-keystore.sh — Generate a Java keystore (JKS) for signing the Investment Assistant app.
#
# Usage:
#   bash scripts/generate-keystore.sh [options]
#
# Options (all optional — defaults shown below):
#   -o  Output file path       (default: investment-assistant.jks)
#   -a  Key alias              (default: investment-assistant-key)
#   -p  Key & store password   (default: prompt interactively)
#   -v  Validity in days       (default: 10000)
#   -n  Common Name (CN)       (default: Investment Assistant)
#   -u  Organizational Unit    (default: Mobile)
#   -g  Organization           (default: Investment Assistant)
#   -l  City / Locality        (default: Unknown)
#   -s  State / Province       (default: Unknown)
#   -c  Country Code (2 chars) (default: US)
#
# Requirements: keytool (bundled with any JDK)

set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────
OUTPUT="investment-assistant.jks"
ALIAS="investment-assistant-key"
VALIDITY=10000
CN="Investment Assistant"
OU="Mobile"
O="Investment Assistant"
L="Unknown"
ST="Unknown"
C="US"
PASSWORD=""

# ── Argument parsing ───────────────────────────────────────────────────────────
while getopts "o:a:p:v:n:u:g:l:s:c:h" opt; do
  case "$opt" in
    o) OUTPUT="$OPTARG" ;;
    a) ALIAS="$OPTARG" ;;
    p) PASSWORD="$OPTARG" ;;
    v) VALIDITY="$OPTARG" ;;
    n) CN="$OPTARG" ;;
    u) OU="$OPTARG" ;;
    g) O="$OPTARG" ;;
    l) L="$OPTARG" ;;
    s) ST="$OPTARG" ;;
    c) C="$OPTARG" ;;
    h)
      # Print the leading comment block (lines starting with '#' before the first blank/code line)
      awk '/^[^#]/{exit} /^#/{sub(/^# ?/,""); print}' "$0"
      exit 0
      ;;
    *) echo "Unknown option: -$OPTARG" >&2; exit 1 ;;
  esac
done

# ── Dependency check ───────────────────────────────────────────────────────────
if ! command -v keytool &>/dev/null; then
  echo "ERROR: 'keytool' not found. Please install a JDK and ensure it is on your PATH." >&2
  exit 1
fi

# ── Password prompt ────────────────────────────────────────────────────────────
if [[ -z "$PASSWORD" ]]; then
  read -r -s -p "Enter keystore/key password (min 6 chars): " PASSWORD
  echo
  read -r -s -p "Confirm password: " PASSWORD2
  echo
  if [[ "$PASSWORD" != "$PASSWORD2" ]]; then
    echo "ERROR: Passwords do not match." >&2
    exit 1
  fi
fi

if [[ ${#PASSWORD} -lt 6 ]]; then
  echo "ERROR: Password must be at least 6 characters." >&2
  exit 1
fi

# ── Generate keystore ──────────────────────────────────────────────────────────
DNAME="CN=${CN}, OU=${OU}, O=${O}, L=${L}, ST=${ST}, C=${C}"

echo ""
echo "Generating keystore..."
echo "  Output : $OUTPUT"
echo "  Alias  : $ALIAS"
echo "  Dname  : $DNAME"
echo "  Validity: ${VALIDITY} days"
echo ""

keytool -genkeypair \
  -keystore "$OUTPUT" \
  -alias    "$ALIAS" \
  -keyalg   RSA \
  -keysize  4096 \
  -sigalg   SHA256withRSA \
  -validity "$VALIDITY" \
  -dname    "$DNAME" \
  -storepass "$PASSWORD" \
  -keypass   "$PASSWORD"

echo ""
echo "✅  Keystore generated: $OUTPUT"
echo ""
echo "⚠️  SECURITY REMINDER:"
echo "   • Keep this file and its password private."
echo "   • Do NOT commit it to version control (it is in .gitignore)."
echo "   • Back it up securely — losing the keystore means you cannot update your app."
