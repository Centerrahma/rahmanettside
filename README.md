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

Prayer times require `MYMASJID_API_URL` (the API base URL) and
`MYMASJID_MOSQUE_ID` (the mosque GUID) in the deployment environment. The homepage
and contact page read these at request time. Prayer requests have a 10-second
timeout; failures show unavailable times rather than a sample timetable. The
prayer API returns an uncached 503 on failure. The homepage refreshes its daily
schedule every minute and on focus, retaining today's last successful response
during temporary failures and hiding expired schedules after Oslo midnight.
Tomorrow's Fajr uses the next Oslo calendar day, including clock-change nights.

The contact and membership forms send email through Microsoft Graph, as the `webside@centerrahma.no` mailbox in the mosque's Microsoft 365 tenant. No SMTP and no secret: the Entra app "Center Rahma Website Contact Form" trusts Vercel's OIDC token (federated credential), and Exchange RBAC limits it to sending as that one mailbox. [docs/microsoft-graph-mail.md](docs/microsoft-graph-mail.md) describes the setup (in Norwegian). Set these in Vercel (Production) and redeploy:

| Variable | Required | Description |
|---|---|---|
| `AZURE_TENANT_ID` | yes | Directory (tenant) ID of the Microsoft 365 tenant. |
| `AZURE_CLIENT_ID` | yes | Application (client) ID of the Entra app. |
| `CONTACT_MAIL_FROM` | no | Sending mailbox. Defaults to `webside@centerrahma.no`. |
| `CONTACT_MAIL_TO` | no | Where submissions are delivered. Defaults to `post@centerrahma.no`. |

The federated credential covers Production only, so sending fails on Preview and locally (the forms return 500 and log the error).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
