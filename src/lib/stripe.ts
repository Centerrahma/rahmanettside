import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - payments will not work');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil' as any,
});

export async function createCheckoutSession(params: {
  amount: number;
  currency: string;
  frequency: 'one-time' | 'monthly';
  project?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // For one-time: payment mode, for monthly: subscription mode
  if (params.frequency === 'monthly') {
    // Create a price for the subscription
    const price = await stripe.prices.create({
      unit_amount: params.amount * 100, // Convert to øre
      currency: params.currency,
      recurring: { interval: 'month' },
      product_data: {
        name: `Monthly donation${params.project ? ` - ${params.project}` : ''}`,
      },
    });

    return stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      locale: 'nb',
    });
  }

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: params.currency,
          unit_amount: params.amount * 100,
          product_data: {
            name: `Donation${params.project ? ` - ${params.project}` : ''}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: 'nb',
  });
}
