import { z } from "zod";
import { TAUX_TVA_OPTIONS } from "@/lib/legal";

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  companyName: z.string().trim().min(1).max(120).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

const nouveauClientSchema = z.object({
  name: z.string().trim().min(1, "Le nom du client est requis.").max(160),
  address: z.string().trim().min(1, "L'adresse est requise.").max(200),
  zipCode: z.string().trim().min(1, "Le code postal est requis.").max(10),
  city: z.string().trim().min(1, "La ville est requise.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email client invalide.")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

const ligneDevisSchema = z.object({
  description: z.string().trim().min(1, "Description requise.").max(300),
  quantite: z.coerce.number().positive("La quantité doit être positive."),
  prixUnitaireHT: z.coerce
    .number()
    .nonnegative("Le prix unitaire ne peut pas être négatif."),
  tauxTVA: z
    .coerce.number()
    .refine(
      (v) => (TAUX_TVA_OPTIONS as readonly number[]).includes(v),
      "Taux de TVA invalide.",
    ),
});

export const creerDevisSchema = z
  .object({
    clientId: z.string().trim().optional().or(z.literal("")),
    nouveauClient: nouveauClientSchema.optional(),
    lignes: z
      .array(ligneDevisSchema)
      .min(1, "Ajoute au moins une ligne de prestation."),
  })
  .refine((data) => data.clientId || data.nouveauClient, {
    message: "Sélectionne un client existant ou renseigne un nouveau client.",
  });
