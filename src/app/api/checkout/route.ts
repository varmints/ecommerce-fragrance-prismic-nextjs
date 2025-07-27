import { NextResponse } from 'next/server';
import { asText } from '@prismicio/client';
import Stripe from 'stripe';
import { createClient } from '@/prismicio';
import { CartItem } from '@/context/CartContext';
import { reverseLocaleLookup } from '@/i18n';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  const { cart, lang } = (await request.json()) as { cart: CartItem[]; lang: string };
  const prismicLang = reverseLocaleLookup(lang);

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Cart is empty or invalid.' }, { status: 400 });
  }

  const client = createClient();

  try {
    // Pobierz wszystkie unikalne ID produktów z koszyka
    const productIds = [...new Set(cart.map(item => item.uid))];
    const prismicProducts = await client.getAllByIDs(productIds, { lang: prismicLang });

    // Stwórz mapę produktów z Prismic dla łatwego dostępu
    const prismicProductMap = new Map(prismicProducts.map(p => [p.id, p]));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cart) {
      const prismicProduct = prismicProductMap.get(item.uid);

      if (!prismicProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item.uid} not found.` },
          { status: 404 }
        );
      }

      // Sprawdź typ dokumentu
      if (prismicProduct.type !== 'fragrance') {
        return NextResponse.json(
          { error: `Product with ID ${item.uid} is not a fragrance.` },
          { status: 400 }
        );
      }

      // Teraz TypeScript wie, że to FragranceDocument
      const priceInCents = prismicProduct.data.price || 0;

      if (priceInCents === 0) {
        // Możesz chcieć obsłużyć darmowe produkty inaczej lub zablokować
        console.warn(`Product ${item.name} has a price of 0.`);
      }

      line_items.push({
        price_data: {
          currency: 'pln', // Można to również uczynić dynamicznym
          product_data: {
            name: asText(prismicProduct.data.title) || 'Unnamed Product',
            images: prismicProduct.data.bottle_image?.url
              ? [prismicProduct.data.bottle_image.url]
              : [],
            metadata: {
              prismicId: prismicProduct.id,
            },
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/${lang}/order/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/${lang}/order/cancel`;

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'pln' }, // 15 PLN
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            display_name: 'Express Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 3000, currency: 'pln' }, // 30 PLN
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: [
          'AT',
          'BE',
          'BG',
          'CY',
          'CZ',
          'DE',
          'DK',
          'EE',
          'ES',
          'FI',
          'FR',
          'GR',
          'HR',
          'HU',
          'IE',
          'IS',
          'IT',
          'LI',
          'LT',
          'LU',
          'LV',
          'MT',
          'NL',
          'NO',
          'PL',
        ],
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not create Stripe session.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
