export type LigneCalcul = {
  quantite: number;
  prixUnitaireHT: number;
  tauxTVA: number;
};

function arrondi(valeur: number) {
  return Math.round(valeur * 100) / 100;
}

export function calculerLigne(ligne: LigneCalcul) {
  return arrondi(ligne.quantite * ligne.prixUnitaireHT);
}

export function calculerTotaux(lignes: LigneCalcul[]) {
  let totalHT = 0;
  let totalTVA = 0;

  for (const ligne of lignes) {
    const ligneHT = calculerLigne(ligne);
    totalHT += ligneHT;
    totalTVA += ligneHT * (ligne.tauxTVA / 100);
  }

  totalHT = arrondi(totalHT);
  totalTVA = arrondi(totalTVA);
  const totalTTC = arrondi(totalHT + totalTVA);

  return { totalHT, totalTVA, totalTTC };
}

export function formaterMontant(valeur: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(valeur);
}

// Les polices standard des PDF (Helvetica) n'ont pas le glyphe de l'espace
// insécable fine (U+202F) utilisé par Intl pour les milliers en fr-FR ; sans
// ce correctif, il s'affiche comme "/". À utiliser uniquement dans les PDF.
export function formaterMontantPdf(valeur: number) {
  return formaterMontant(valeur).replace(/[  ]/g, " ");
}
