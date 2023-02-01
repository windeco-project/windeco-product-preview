import { AlphaMode } from '../enums'

export interface MaterialFormData {
  label: string
  is_cloth: boolean
  metalness?: number
  roughness?: number
  sheen?: number
  sheen_color?: string
  specular_color?: string
  color?: number
  opacity?: number
  alpha_mode?: AlphaMode
  scale?: number
  rotation?: number
  diffuse_texture?: File
  metallic_roughness_texture?: File
  normal_texture?: File
  occlusion_texture?: File
  emission_texture?: File
  sheen_texture?: File
  specular_texture?: File
}
