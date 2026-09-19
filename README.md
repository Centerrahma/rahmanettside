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

The contact and membership forms send email through the mosque's one.com mailbox. Set these in Vercel (Settings → Environment Variables, Production) and redeploy:

| Variable | Required | Description |
|---|---|---|
| `SMTP_USER` | yes | Full address of the one.com mailbox that sends, e.g. `nettside@centerrahma.no`. Also used as the From address. |
| `SMTP_PASSWORD` | yes | That mailbox's password. Mark it **Sensitive** in Vercel. |
| `CONTACT_EMAIL_TO` | no | Where form submissions are delivered. Defaults to `post@centerrahma.no`. |
| `SMTP_HOST` / `SMTP_PORT` | no | Default `send.one.com` / `465`. Only change if the mailbox moves off one.com. |

Locally, put them in `.env.local` (gitignored). Without them the forms return a 500 and log `SMTP_USER and SMTP_PASSWORD environment variables must be set`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
