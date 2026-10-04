import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { DevisDocument, type DevisDocumentProps } from "@/lib/pdf/DevisDocument";

export async function generateDevisPdf(props: DevisDocumentProps) {
  // DevisDocument renders a <Document> at its root, but its own prop type
  // (devis/emetteur) differs from DocumentProps — react-pdf's types want the
  // latter, so we assert what we know to be true about the rendered tree.
  const element = createElement(DevisDocument, props) as ReactElement<DocumentProps>;
  return renderToBuffer(element);
}
