import "dotenv/config";
import Stripe from "stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("STRIPE_SECRET_KEY manquante dans .env — ajoute-la avant de lancer ce script.");
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
    unit_amount: 1900,
    recurring: { interval: "month" },
  });

  console.log("\nProduit et prix créés avec succès.");
  console.log("Ajoute cette ligne à ton fichier .env :\n");
  console.log(`STRIPE_PRICE_ID=${price.id}\n`);
}

main();
