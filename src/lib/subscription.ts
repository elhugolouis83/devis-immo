import { prisma } from "@/lib/prisma";

export const DEVIS_GRATUITS = 3;

export async function getAccesStatus(userId: string) {
  const [subscription, devisCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.devis.count({ where: { userId } }),
  ]);

  const estAbonne = subscription?.status === "active";
  const restants = Math.max(0, DEVIS_GRATUITS - devisCount);

  return {
    subscription,
    devisCount,
    estAbonne,
    restants,
    peutCreerDevis: estAbonne || devisCount < DEVIS_GRATUITS,
  };
}
