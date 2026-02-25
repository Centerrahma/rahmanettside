import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendContactEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const to = process.env.CONTACT_EMAIL_TO || 'post@centerrahma.no';

  return resend.emails.send({
    from: 'Masjid Rahma <noreply@masjidrahma.no>',
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

  return resend.emails.send({
    from: 'Masjid Rahma <noreply@masjidrahma.no>',
    to,
    replyTo: data.email,
    subject: `New Membership Application - ${data.fullName}`,
    text: `New Membership Application\n\nFull Name: ${data.fullName}\nAddress: ${data.address}\nPostal Code: ${data.postalCode}\nCity: ${data.city}\nPhone: ${data.phone}\nEmail: ${data.email}\nFødselsnummer: ${data.fodselsnummer}\n\nSubmitted via the website membership form.`,
  });
}

export async function addToNewsletter(email: string) {
  // Resend audience - for now just log
  console.log('Newsletter signup:', email);
  // When audience is set up:
  // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID || '' });
}
