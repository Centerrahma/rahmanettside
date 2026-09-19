import nodemailer, { type Transporter } from 'nodemailer';

let _transporter: Transporter | null = null;

// Sends through the mosque's own one.com mailbox, so no third-party sender
// domain has to be verified. one.com only accepts mail whose From address is
// the authenticated mailbox, so SMTP_USER doubles as the sender.
function getTransporter(): Transporter {
  if (!_transporter) {
    const { SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_USER || !SMTP_PASSWORD) {
      throw new Error('SMTP_USER and SMTP_PASSWORD environment variables must be set');
    }
    const port = Number(process.env.SMTP_PORT) || 465;
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'send.one.com',
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      // Fail fast instead of hanging the serverless function on a dead connection.
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return _transporter;
}

function fromAddress(): string {
  return `Masjid Rahma <${process.env.SMTP_USER}>`;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const to = process.env.CONTACT_EMAIL_TO || 'post@centerrahma.no';

  // sendMail rejects on any SMTP failure, so the API route returns 500
  // instead of reporting success for an email that never left.
  return getTransporter().sendMail({
    from: fromAddress(),
    to,
    replyTo: data.email,
    subject: `Contact: ${data.topic} - from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nTopic: ${data.topic}\n\nMessage:\n${data.message}`,
  });
}

export async function sendMembershipEmail(data: {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  fodselsnummer: string;
}) {
  const to = process.env.CONTACT_EMAIL_TO || 'post@centerrahma.no';

  return getTransporter().sendMail({
    from: fromAddress(),
    to,
    replyTo: data.email,
    subject: `New Membership Application - ${data.fullName}`,
    text: `New Membership Application\n\nFull Name: ${data.fullName}\nAddress: ${data.address}\nPostal Code: ${data.postalCode}\nCity: ${data.city}\nPhone: ${data.phone}\nEmail: ${data.email}\nFødselsnummer: ${data.fodselsnummer}\n\nSubmitted via the website membership form.`,
  });
}

export async function addToNewsletter(email: string) {
  // No mailing-list provider is connected yet - for now just log.
  console.log('Newsletter signup:', email);
}
