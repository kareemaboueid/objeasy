# GPG Commit Signing Setup Guide

## Step 1: Generate a GPG Key

Run this command and follow the prompts:

```bash
gpg --full-generate-key
```

When prompted:

- Select: **1** (RSA and RSA)
- Key size: **4096** bits
- Valid for: **0** (key does not expire) or **1y** (1 year)
- Enter your name (same as your Git config)
- Enter your email (same as your Git config - make sure it's verified on GitHub)
- Enter a secure passphrase

## Step 2: Get Your Key ID

```bash
gpg --list-secret-keys --keyid-format=long
```

Look for the line starting with `sec` and copy the key ID (after the `/`).
Example: If you see `sec   rsa4096/ABC123DEF456789`, then `ABC123DEF456789` is your key ID.

## Step 3: Configure Git to Use Your GPG Key

Replace `YOUR_KEY_ID` with your actual key ID:

```bash
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

## Step 4: Export Your Public Key for GitHub

Replace `YOUR_KEY_ID` with your actual key ID:

```bash
gpg --armor --export YOUR_KEY_ID
```

Copy the output (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`).

## Step 5: Add Your GPG Key to GitHub

1. Go to GitHub Settings → SSH and GPG keys
2. Click "New GPG key"
3. Paste your public key
4. Click "Add GPG key"

## Step 6: Test Your Setup

Make a test commit:

```bash
git commit -m "Test signed commit"
```

You should be prompted for your GPG passphrase.

## Optional: Enable Vigilant Mode

In GitHub Settings → SSH and GPG keys → Enable "Flag unsigned commits as unverified"

This will mark all your unsigned commits as unverified, encouraging consistent signing.
