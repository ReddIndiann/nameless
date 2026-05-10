export type ElementType = 'text' | 'image'

export interface DesignElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  
  // Text specific
  text?: string
  fontSize?: number
  fill?: string
  fontFamily?: string
  
  // Image specific
  url?: string
  opacity?: number
}

export interface DesignerState {
  elements: DesignElement[]
  selectedId: string | null
}
