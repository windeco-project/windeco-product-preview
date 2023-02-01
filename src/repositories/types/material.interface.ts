import type { GlTFProperty } from '../../material/types/gltf-material.interface'
import { AlphaMode } from '../enums'

export interface MaterialInterface extends GlTFProperty {
  id?: string
  label: string
  is_cloth: boolean
  metalness: number
  roughness: number
  scale?: number
  rotation?: number
  sheen?: number
  color?: string
  sheen_color?: string
  specular_color?: string
  opacity: number
  alpha_mode: AlphaMode
  diffuse_texture?: string
  metallic_roughness_texture?: string
  normal_texture?: string
  occlusion_texture?: string
  emission_texture?: string
  sheen_texture?: string
  specular_texture?: string
}
