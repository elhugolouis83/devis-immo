import "dotenv/config";
import Stripe from "stripe";

const OLD_PRICE_ID = "price_1UMpCI1VjO7nzKGTAfSfLhRh";
const NEW_AMOUNT_CENTS = 2500;

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("STRIPE_SECRET_KEY manquante dans .env");
    process.exit(1);
  }
  const stripe = new Stripe(key);

  const oldPrice = await stripe.prices.retrieve(OLD_PRICE_ID);
  const productId =
    typeof oldPrice.product === "string" ? oldPrice.product : oldPrice.product.id;

  const newPrice = await stripe.prices.create({
    product: productId,
    currency: "eur",
    unit_amount: NEW_AMOUNT_CENTS,
    recurring: { interval: "month" },
  });

  await stripe.prices.update(OLD_PRICE_ID, { active: false });

  console.log("\nNouveau prix créé, ancien prix désactivé.");
  console.log("Remplace la ligne STRIPE_PRICE_ID dans .env par :\n");
  console.log(`STRIPE_PRICE_ID=${newPrice.id}\n`);
}

main();
