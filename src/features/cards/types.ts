/** Carta del catálogo. Ver `Modelos y Contratos/Cartas y Rarezas.md`. */
export interface Card {
  _id: string
  name: string
  description: string
  /** Rareza: 0 Común … 4 Mítica (`shared/config/rarities.ts`). */
  type: number
  /** URL absoluta; puede faltar. */
  imageUrl?: string
  author?: string
}
