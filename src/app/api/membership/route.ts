import { NextRequest, NextResponse } from 'next/server';
import { sendMembershipEmail } from '@/lib/resend';
import { isValidFodselsnummer } from '@/lib/fodselsnummer';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }

  entry.count++;
  return entry.count > 5;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fullName, address, postalCode, city, phone, email, fodselsnummer } = body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is required (minimum 2 characters)' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!postalCode || typeof postalCode !== 'string' || !/^\d{4}$/.test(postalCode.trim())) {
      return NextResponse.json(
        { error: 'Valid postal code is required (4 digits)' },
        { status: 400 }
      );
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'Valid phone number is required' },
        { status: 400 }
      );
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!fodselsnummer || typeof fodselsnummer !== 'string') {
      return NextResponse.json(
        { error: 'Fødselsnummer is required' },
        { status: 400 }
      );
    }

    const cleanedFnr = fodselsnummer.replace(/\s/g, '');
    if (!isValidFodselsnummer(cleanedFnr)) {
      return NextResponse.json(
        { error: 'Invalid fødselsnummer' },
        { status: 400 }
      );
    }

    await sendMembershipEmail({
      fullName: fullName.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
      phone: phone.trim(),
      email: email.trim(),
      fodselsnummer: cleanedFnr,
    });

    return NextResponse.json(
      { success: true, message: 'Membership application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Membership form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit membership application' },
      { status: 500 }
    );
  }
}
