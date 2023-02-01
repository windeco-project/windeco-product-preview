import { MediumCategory } from '../enums'

export interface MediumFormData {
  media: File
  label?: string
  description?: string
  is_used?: boolean
  tenant?: string
  fitting?: number
  category: MediumCategory
}
