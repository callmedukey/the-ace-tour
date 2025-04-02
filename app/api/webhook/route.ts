import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateBookingAfterPayment } from "@/actions/booking";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// This is your Stripe webhook secret for testing your endpoint locally
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log("Stripe webhook received");

  // In Edge runtime, we need to clone the request before reading the body
  // This ensures we can access the raw body for signature verification
  const payload = await request.text();

  if (!payload) {
    console.error("Empty payload received");
    return NextResponse.json({ error: "Empty payload" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found in request headers");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log(`Webhook verified successfully: ${event.type}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Make sure the session is paid
      if (session.payment_status === "paid") {
        const stripeId = session.client_reference_id;

        if (!stripeId) {
          console.error("No client_reference_id found in session");
          return NextResponse.json(
            { error: "Missing client_reference_id" },
            { status: 400 }
          );
        }

        try {
          console.log(
            `Processing payment for booking with stripeId: ${stripeId}`
          );

          // Extract payment intent ID correctly - it could be a string or object
          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id;

          if (!paymentIntentId) {
            console.error("No payment_intent found in session");
            return NextResponse.json(
              { error: "Missing payment_intent" },
              { status: 400 }
            );
          }

          // Update the booking with payment information
          await updateBookingAfterPayment(stripeId, {
            paymentId: paymentIntentId,
            paymentMethod: session.payment_method_types?.[0] || "card",
          });

          console.log(`Successfully updated booking: ${stripeId}`);
        } catch (error) {
          console.error(
            `Error updating booking after payment: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          return NextResponse.json(
            { error: "Failed to update booking" },
            { status: 500 }
          );
        }
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // You can use payment_intent.metadata.stripeId if you added it during session creation
      // This is a fallback in case the checkout.session.completed event fails
      if (paymentIntent.metadata?.stripeId) {
        try {
          console.log(
            `Processing payment intent for booking with stripeId: ${paymentIntent.metadata.stripeId}`
          );

          await updateBookingAfterPayment(paymentIntent.metadata.stripeId, {
            paymentId: paymentIntent.id,
            paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
          });

          console.log(
            `Successfully updated booking from payment intent: ${paymentIntent.metadata.stripeId}`
          );
        } catch (error) {
          console.error(
            `Error updating booking from payment intent: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          return NextResponse.json(
            { error: "Failed to update booking from payment intent" },
            { status: 500 }
          );
        }
      } else {
        console.warn(
          `Payment intent ${paymentIntent.id} has no stripeId in metadata`
        );
      }
      break;
    }

    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  console.log("Webhook processed successfully");
  return NextResponse.json({ received: true, type: event.type });
}
