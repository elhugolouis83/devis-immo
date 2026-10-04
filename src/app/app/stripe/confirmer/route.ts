import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getStripe, getAppUrl } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const appUrl = getAppUrl();
  if (!user) {
    return NextResponse.redirect(`${appUrl}/connexion`);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(`${appUrl}/app/reglages`);
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (
    session.customer &&
    typeof session.subscription === "object" &&
    session.subscription !== null
  ) {
    const sub = session.subscription;
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer.id;
    const item = sub.items.data[0];

    await prisma.subscription.updateMany({
      where: { userId: user.id },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: sub.id,
        status: sub.status,
        currentPeriodEnd: item ? new Date(item.current_period_end * 1000) : null,
      },
    });
  }

  return NextResponse.redirect(`${appUrl}/app/reglages?abonnement=actif`);
}
