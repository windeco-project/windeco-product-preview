import { MediumCategory } from "../enums"

export interface MediumInterface {
  id: string
  path: string
  mime_type: string
  label: string
  description: string
  file_size: number
  fitting: number
  is_used: boolean
  width: number
  height: number
  category: MediumCategory
  texture_usage: string
  uploaded_at: string
  created_at: string
  updated_at: string
}
