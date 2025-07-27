import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Obsługa różnych typów zdarzeń
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`✅ Payment successful for session: ${session.id}`);

      // TODO: W tym miejscu należy zaimplementować logikę po udanej płatności:
      // 1. Pobierz szczegóły zamówienia z `session`.
      //    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      // 2. Zapisz zamówienie w swojej bazie danych.
      // 3. Wyślij e-mail z potwierdzeniem do klienta.
      // 4. Zaktualizuj stany magazynowe.
      // 5. Wyczyść koszyk użytkownika (np. za pomocą sygnału do frontendu lub przy następnej wizycie).

      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);
      // Można tu obsłużyć dodatkowe logiki związane z samą płatnością
      break;

    // ... obsłuż inne typy zdarzeń, jeśli potrzebujesz

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
