"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, destroySession } from "@/lib/auth";
import { getStripe, getAppUrl } from "@/lib/stripe";

export async function creerSessionCheckout() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error("STRIPE_PRICE_ID manquante dans .env");

  const stripe = getStripe();
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  let customerId = subscription?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.companyName ?? undefined,
    });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, stripeCustomerId: customerId, status: "inactive" },
      update: { stripeCustomerId: customerId },
    });
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app/stripe/confirmer?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/app/reglages?abonnement=annule`,
  });

  if (!session.url) throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
  redirect(session.url);
}

export async function creerSessionPortail() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });
  if (!subscription?.stripeCustomerId) {
    redirect("/app/reglages");
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${getAppUrl()}/app/reglages`,
  });

  redirect(session.url);
}

export type ProfilFormState = { error: string } | { success: true } | undefined;

export async function mettreAJourProfil(
  _prevState: ProfilFormState,
  formData: FormData,
): Promise<ProfilFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const companyName = String(formData.get("companyName") || "").trim();
  if (companyName.length > 120) {
    return { error: "Nom trop long (120 caractères maximum)." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { companyName: companyName || null },
  });

  return { success: true };
}

export async function supprimerCompte(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const confirmation = String(formData.get("confirmation") || "")
    .trim()
    .toLowerCase();
  if (confirmation !== user.email.toLowerCase()) {
    redirect("/app/reglages?erreur=confirmation");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });
  if (subscription?.stripeSubscriptionId) {
    try {
      await getStripe().subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch {
      // Abonnement déjà annulé ou introuvable côté Stripe : on continue la suppression.
    }
  }

  await destroySession();
  await prisma.user.delete({ where: { id: user.id } });
  redirect("/");
}
