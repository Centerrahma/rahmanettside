This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment variables

The contact and membership forms send email through Microsoft Graph, as a mailbox in the mosque's Microsoft 365 tenant (centerrahma.no). No SMTP is involved. An Entra app signs in with its own client secret; [docs/microsoft-graph-mail.md](docs/microsoft-graph-mail.md) has the setup steps (in Norwegian) for whoever administers the tenant. Set these in Vercel (Settings → Environment Variables, Production) and redeploy:

| Variable | Required | Description |
|---|---|---|
| `MS_TENANT_ID` | yes | Directory (tenant) ID of the Microsoft 365 tenant. |
| `MS_CLIENT_ID` | yes | Application (client) ID of the Entra app registration. |
| `MS_CLIENT_SECRET` | yes | The app's client secret (the *Value*, not the Secret ID). Mark it **Sensitive** in Vercel. It expires; renew it before then. |
| `MS_SENDER` | yes | The mailbox the site sends as, e.g. `webside@centerrahma.no`. Also the From address. |
| `CONTACT_EMAIL_TO` | no | Where form submissions are delivered. Defaults to `post@centerrahma.no`. |

Locally, copy `.env.example` to `.env.local` (gitignored) and fill it in. Without the `MS_*` values the forms return a 500 and log `Missing environment variables for Microsoft Graph mail: …`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
