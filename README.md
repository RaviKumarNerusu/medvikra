# MedGenesis website

Public-facing React/Vite website for Medvikra Private Limited. It contains no authentication or admin routes. Unavailable company images render as labelled placeholders and can be replaced by uploading files with the exact names documented in [`public/images/README.md`](public/images/README.md).

## Local development

1. Install Node.js LTS and open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add `RESEND_API_KEY` and `CONTACT_EMAIL` if enquiry delivery is required.
4. Run `npm run dev`, then open the displayed Vite URL.

Without Resend credentials, the form intentionally shows a configuration error rather than claiming delivery.

## Build and preview

Run `npm run build`, then `npm run preview`.

## Enquiry delivery

`api/enquiry.js` validates input, rejects the honeypot field, sanitizes content, and sends via Resend. Add the environment variables in Vercel Project Settings > Environment Variables. Keep API keys server-side; never add them to frontend code. For production, configure a verified Resend sender domain instead of the development sender.

## GitHub and Vercel

```bash
git init
git add .
git commit -m "Initial MedGenesis website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Import the repository into Vercel, select Vite, use `npm run build` and `dist`, and add the environment variables. The current Vercel project is `medgenesis`, with `medvikra.in` as its intended production domain.

### GoDaddy DNS records

In GoDaddy DNS Management for `medvikra.in`, preserve existing email-related `MX`, `SPF`, `DKIM`, and `DMARC` records. Add the following records exactly:

| Type | Name | Value |
|---|---|---|
| A | `@` | `216.198.79.1` |
| A | `@` | `64.29.17.1` |
| CNAME | `www` | `f61e069d0bcb485d.vercel-dns-017.com.` |

Remove only conflicting old `A` records for `@` or conflicting `CNAME` records for `www`. Do not change nameservers unless Vercel specifically instructs you to do so. Wait for DNS propagation, then verify both domains in Vercel. HTTPS is provisioned by Vercel after verification.
