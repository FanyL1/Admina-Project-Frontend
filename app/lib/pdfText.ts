'use client';

import * as pdfjsLib from 'pdfjs-dist';

interface PdfTextItemLike {
  str?: string;
  hasEOL?: boolean;
}

export interface PdfTextOptions {
  /** Separador entre páginas. Se usa '\n' para conservar el contexto de filas. */
  pageJoiner?: string;
}

/**
 * Extrae el texto del PDF conservando los saltos de línea originales.
 *
 * pdf.js emite items con `hasEOL`; unir todo con espacios (como se hacía antes)
 * destruye las filas partidas y hace imposible distinguir encabezados de datos.
 */
export const readPdfText = async (file: File, options: PdfTextOptions = {}): Promise<string> => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const data = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const lines: string[] = [];
      let line = '';

      for (const rawItem of textContent.items) {
        if (!rawItem || typeof rawItem !== 'object' || !('str' in rawItem)) continue;
        const item = rawItem as PdfTextItemLike;
        const value = typeof item.str === 'string' ? item.str : '';

        if (value.includes('\n')) {
          const parts = value.split('\n');
          parts.forEach((part, index) => {
            if (index > 0) {
              lines.push(line);
              line = '';
            }
            line += part;
          });
          if (item.hasEOL) {
            lines.push(line);
            line = '';
          }
          continue;
        }

        line += value;
        if (item.hasEOL) {
          lines.push(line);
          line = '';
        }
      }

      if (line.trim()) lines.push(line);
      pages.push(lines.join('\n'));
    }
  } finally {
    await pdf.cleanup();
    await loadingTask.destroy();
  }

  return pages.join(options.pageJoiner ?? '\n');
};
