import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/activate-own-subscription.ts <email>");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Aucun compte trouvé avec l'email ${email}. Crée le compte via le site d'abord.`);
    process.exit(1);
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, status: "active" },
    update: { status: "active" },
  });

  console.log(`Abonnement activé pour ${email}.`);
  await prisma.$disconnect();
}

main();
