# Security Configuration

## ⚠️ IMPORTANT SECURITY NOTICE

This application requires proper security configuration for production use.

### Master Admin Setup

1. **Never commit passwords to Git**
2. Copy `.env.local.example` to `.env.local`
3. Set strong passwords in `.env.local`
4. Add `.env.local` to `.gitignore` (already done)

### Environment Variables Required

```bash
# Master Admin Credentials
MASTER_EMAIL=your_admin_email@domain.com
MASTER_PASSWORD=your_very_strong_password_here
```

### Password Requirements

- Minimum 12 characters
- Include uppercase and lowercase letters
- Include numbers
- Include special characters

### Running the Master Admin Creation Script

```bash
# Set environment variables first
export MASTER_PASSWORD="YourSecurePassword123!@#"
export MASTER_EMAIL="admin@yourdomain.com"

# Then run the script
npx tsx scripts/create-master.ts
```

### Security Best Practices

1. **Use environment variables** for all sensitive data
2. **Enable 2FA** for GitHub accounts
3. **Rotate passwords** regularly
4. **Use secure password managers**
5. **Never share credentials** in code or documentation

### If Credentials Are Exposed

1. **Immediately change** all exposed passwords
2. **Rotate** API keys and secrets
3. **Review** access logs for unauthorized use
4. **Enable** GitGuardian or similar secret scanning tools

## Contact

For security concerns, contact: security@drucker.com