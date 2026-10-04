import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { MENTIONS_CGV, MENTIONS_DISCLAIMER } from "@/lib/legal";
import { formaterMontantPdf } from "@/lib/montants";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 48,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1C1F26",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  brand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  devisNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  muted: {
    color: "#6B6B65",
  },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  partyBlock: {
    width: "47%",
  },
  partyLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6B6B65",
    marginBottom: 4,
  },
  table: {
    marginTop: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1C1F26",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDD8CF",
    paddingVertical: 5,
  },
  colDescription: { width: "46%" },
  colQty: { width: "10%", textAlign: "right" },
  colPrice: { width: "16%", textAlign: "right" },
  colTva: { width: "12%", textAlign: "right" },
  colTotal: { width: "16%", textAlign: "right" },
  thText: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6B6B65",
  },
  totauxBlock: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  totauxLigne: {
    flexDirection: "row",
    width: 180,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  totalTTCLigne: {
    flexDirection: "row",
    width: 180,
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#1C1F26",
  },
  totalTTCLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  cgvSection: {
    marginTop: 32,
  },
  cgvTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  cgvItem: {
    fontSize: 8,
    color: "#40434D",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  disclaimer: {
    fontSize: 7,
    color: "#6B6B65",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export type DevisDocumentProps = {
  devis: {
    number: string;
    status: string;
    issuedAt: Date;
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    client: {
      name: string;
      address: string;
      zipCode: string;
      city: string;
      email: string | null;
    };
    lignes: {
      id: string;
      description: string;
      quantite: number;
      prixUnitaireHT: number;
      tauxTVA: number;
      totalLigneHT: number;
    }[];
  };
  emetteur: {
    nom: string;
  };
};

export function DevisDocument({ devis, emetteur }: DevisDocumentProps) {
  return (
    <Document title={devis.number}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>DevisImmo</Text>
            <Text style={styles.muted}>{emetteur.nom}</Text>
          </View>
          <View>
            <Text style={styles.devisNumber}>{devis.number}</Text>
            <Text style={styles.muted}>
              {new Intl.DateTimeFormat("fr-FR").format(devis.issuedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Émetteur</Text>
            <Text>{emetteur.nom}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Client</Text>
            <Text>{devis.client.name}</Text>
            <Text>{devis.client.address}</Text>
            <Text>
              {devis.client.zipCode} {devis.client.city}
            </Text>
            {devis.client.email && <Text>{devis.client.email}</Text>}
          </View>
        </View>

        <View style={styles.table} wrap={false}>
          <View style={styles.tableHeaderRow} wrap={false}>
            <Text style={[styles.colDescription, styles.thText]}>Description</Text>
            <Text style={[styles.colQty, styles.thText]}>Qté</Text>
            <Text style={[styles.colPrice, styles.thText]}>Prix HT</Text>
            <Text style={[styles.colTva, styles.thText]}>TVA</Text>
            <Text style={[styles.colTotal, styles.thText]}>Total HT</Text>
          </View>
          {devis.lignes.map((l) => (
            <View key={l.id} style={styles.tableRow} wrap={false}>
              <Text style={styles.colDescription}>{l.description}</Text>
              <Text style={styles.colQty}>{l.quantite}</Text>
              <Text style={styles.colPrice}>{formaterMontantPdf(l.prixUnitaireHT)}</Text>
              <Text style={styles.colTva}>{l.tauxTVA} %</Text>
              <Text style={styles.colTotal}>{formaterMontantPdf(l.totalLigneHT)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totauxBlock}>
          <View style={styles.totauxLigne}>
            <Text style={styles.muted}>Total HT</Text>
            <Text>{formaterMontantPdf(devis.totalHT)}</Text>
          </View>
          <View style={styles.totauxLigne}>
            <Text style={styles.muted}>TVA</Text>
            <Text>{formaterMontantPdf(devis.totalTVA)}</Text>
          </View>
          <View style={styles.totalTTCLigne}>
            <Text style={styles.totalTTCLabel}>Total TTC</Text>
            <Text style={styles.totalTTCLabel}>{formaterMontantPdf(devis.totalTTC)}</Text>
          </View>
        </View>

        <View style={styles.cgvSection}>
          <Text style={styles.cgvTitle}>Conditions générales de vente</Text>
          {MENTIONS_CGV.map((m, i) => (
            <Text key={i} style={styles.cgvItem}>
              • {m}
            </Text>
          ))}
          <Text style={styles.disclaimer}>{MENTIONS_DISCLAIMER}</Text>
        </View>
      </Page>
    </Document>
  );
}
