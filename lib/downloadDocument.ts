import { getDocumentPdfAction } from '@extracom/site-kit/server';

export async function downloadDocumentPdf(
  documentId: string,
  type: string,
  filename: string
): Promise<void> {
  const { base64, contentType } = await getDocumentPdfAction(documentId, type);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: contentType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}