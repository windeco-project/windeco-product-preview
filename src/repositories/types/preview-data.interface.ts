export type MaterialType = {
  texture: string
  color?: string
}

export interface PreviewFormData {
  label: string
  is_environment: boolean
  binary: File
  preview: File
  images: File[]
  environment: string
  kept_materials: string
  fixed_materials: string
  materials: Record<string, MaterialType>
  env_parts: string
  default_hide: string
}
