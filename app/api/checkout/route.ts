import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPendingBooking } from "@/actions/booking";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Required for Stripe v18
});

// Define the request body type
interface CheckoutRequestBody {
  customerEmail: string;
  customerName: string;
  tripType: "One Way" | "Round Trip";
  from: string;
  to: string;
  departingDate: string;
  returningDate?: string;
  departureTime: string;
  returnTime?: string;
  passengers: number;
  pickUpaddress: string;
  dropOffaddress: string;
  price: string;
  returnUrl: string;
  luggage: number;
}

export async function POST(request: NextRequest) {
  console.log("Checkout request received");

  try {
    const body = (await request.json()) as CheckoutRequestBody;

    if (!body) {
      console.error("Empty request body");
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }
    const {
      customerEmail,
      customerName,
      tripType,
      from,
      to,
      departingDate,
      returningDate,
      departureTime,
      returnTime,
      passengers,
      pickUpaddress,
      dropOffaddress,
      price,
      returnUrl,
      luggage,
    } = body;

    // Generate a unique ID for this booking
    const stripeId = `booking_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;

    // Create a pending booking in the database
    const bookingResult = await createPendingBooking({
      customerEmail,
      customerName,
      tripType: tripType === "One Way" ? "One Way" : "Round Trip",
      from,
      to,
      departingDate: new Date(departingDate),
      returningDate: returningDate ? new Date(returningDate) : undefined,
      departureTime,
      returnTime,
      passengers,
      pickUpaddress,
      dropOffaddress,
      price: parseFloat(price),
      stripeId,
      luggage,
    });

    if (!bookingResult.success) {
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${
                tripType === "One Way" ? "One Way" : "Round Trip"
              } Shuttle: ${from} to ${to}`,
              description: `${departureTime} on ${new Date(
                departingDate
              ).toLocaleDateString()}${
                returningDate
                  ? ` with return on ${new Date(
                      returningDate
                    ).toLocaleDateString()}`
                  : ""
              } | ${passengers} passenger(s) | ${luggage} luggage item(s)${
                luggage > passengers
                  ? ` (includes ${luggage - passengers} extra luggage fee)`
                  : ""
              }`,
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}${returnUrl}?canceled=true`,
      customer_email: customerEmail,
      client_reference_id: stripeId, // Store the booking reference for webhook
      metadata: {
        stripeId,
        customerName,
        from,
        to,
        departingDate,
        tripType,
        luggage: luggage.toString(),
      },
    });

    console.log(`Checkout session created successfully: ${session.id}`);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Checkout API error: ${errorMessage}`);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
