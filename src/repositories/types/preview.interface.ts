import { MaterialType } from './preview-data.interface'

export interface PreviewInterface {
  id: string
  meshes: string[]
  configuration: {
    environment: string[]
    default_hide: string[]
    env_parts: string[]
    material_setup: MaterialType[]
  }
  created_at: string
  updated_at: string
}
