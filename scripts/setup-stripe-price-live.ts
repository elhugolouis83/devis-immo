import "dotenv/config";
import Stripe from "stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY_LIVE_TEMP;
  if (!key) {
    console.error("STRIPE_SECRET_KEY_LIVE_TEMP manquante dans .env — ajoute-la avant de lancer ce script.");
    process.exit(1);
  }
  if (!key.startsWith("sk_live_")) {
    console.error("Cette clé ne ressemble pas à une clé live (elle devrait commencer par sk_live_).");
    process.exit(1);
  }

  const stripe = new Stripe(key);

  const product = await stripe.products.create({
    name: "DevisImmo — Abonnement",
    description: "Génération de devis et factures conformes pour travaux immobiliers.",
  });

  const price = await stripe.prices.create({
    product: product.id,
    currency: "eur",
    unit_amount: 2500,
    recurring: { interval: "month" },
  });

  console.log("\nProduit et prix créés avec succès en mode LIVE.");
  console.log(`STRIPE_PRICE_ID=${price.id}\n`);
}

main();
