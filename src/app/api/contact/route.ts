import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';

const MAX = { name: 100, email: 254, topic: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }

  entry.count++;
  return entry.count > 10;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, topic, message, website } = body;

    // Honeypot: the forms hide a "website" field that only bots fill in.
    // Pretend success so they do not retry.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (
      name.length > MAX.name ||
      email.length > MAX.email ||
      topic.length > MAX.topic ||
      message.length > MAX.message
    ) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }

    // Send email
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      topic: topic.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
