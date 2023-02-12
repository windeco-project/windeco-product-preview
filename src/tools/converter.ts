import { get, set } from 'lodash'
import { ColorUtils, vec3 } from '@gltf-transform/core'
import { MeshPhysicalMaterial, TextureLoader } from 'three'

import { getConfiguration } from '../configuration'
import { GLTFMaterial, Texture } from '../material/types'
import { MaterialInterface } from '../repositories/types'

export const MaterialTextures = [
  'metallic_roughness_texture',
  'occlusion_texture',
  'emission_texture',
  'specular_texture',
  'diffuse_texture',
  'normal_texture',
  'sheen_texture',
]

const loadTexture = (url: string) => new TextureLoader().load(url)

export class ModelMaterialConverter {
  private textures: any[] = []
  private images: any[] = []
  private extensionsUsed: string[] = []

  applyAll(model: any, materials: Record<string, MaterialInterface>) {
    this.textures = model.textures
    this.images = model.images
    this.extensionsUsed = model.extensionsUsed || []

    const gltfMaterials = model.materials.map((material: { name: string }) =>
      Object.keys(materials).includes(material.name)
        ? {
            name: material.name,
            ...this.createGLTFMaterial(materials[material.name]),
          }
        : material,
    )

    return {
      ...model,
      materials: gltfMaterials,
      textures: this.textures,
      images: this.images,
      extensionsUsed: this.extensionsUsed,
    }
  }

  apply(model: object, material: MaterialInterface, fields?: Partial<MaterialInterface>) {
    let merged = material
    if (fields) {
      merged = this.merge(material, fields)
    }

    return {
      ...model,
      materials: [this.createGLTFMaterial(merged)],
      textures: this.textures,
      images: this.images,
      extensionsUsed: this.extensionsUsed,
    }
  }
  applyTextures(material: MeshPhysicalMaterial, fields: Partial<MaterialInterface>) {
    const {
      metallic_roughness_texture,
      occlusion_texture,
      emission_texture,
      specular_texture,
      diffuse_texture,
      normal_texture,
      sheen_texture,
    } = Object.fromEntries(Object.entries(fields).filter(([key, value]) => MaterialTextures.includes(key) && value))
    if (typeof occlusion_texture === 'object' && typeof occlusion_texture.data === 'string') {
      material.aoMap = loadTexture(occlusion_texture.data)
    }
    if (typeof occlusion_texture === 'object' && typeof occlusion_texture.data === 'string') {
      material.aoMap = loadTexture(occlusion_texture.data)
    }
    if (typeof metallic_roughness_texture === 'object' && typeof metallic_roughness_texture.data === 'string') {
      material.metalnessMap = loadTexture(metallic_roughness_texture.data)
      material.roughnessMap = loadTexture(metallic_roughness_texture.data)
    }
    if (typeof normal_texture === 'object' && typeof normal_texture.data === 'string') {
      material.normalMap = loadTexture(normal_texture.data)
    }
    if (typeof sheen_texture === 'object' && typeof sheen_texture.data === 'string') {
      material.sheenColorMap = loadTexture(sheen_texture.data)
    }
    if (typeof diffuse_texture === 'object' && typeof diffuse_texture.data === 'string') {
      material.map = loadTexture(diffuse_texture.data)
    }
    if (typeof emission_texture === 'object' && typeof emission_texture.data === 'string') {
      material.emissiveMap = loadTexture(emission_texture.data)
    }
    if (typeof specular_texture === 'object' && typeof specular_texture.data === 'string') {
      material.emissiveMap = loadTexture(specular_texture.data)
    }

    return material
  }

  private merge(material: MaterialInterface, fields: Partial<MaterialInterface>) {
    const data = Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => !MaterialTextures.includes(key) && value),
    )

    return { ...material, ...data }
  }

  createGLTFMaterial(material: MaterialInterface): GLTFMaterial {
    const gltfMaterial: GLTFMaterial = {}
    if (material.extensions) {
      gltfMaterial.extensions = material.extensions
      Object.keys(material.extensions).forEach((extension) => {
        if (!this.extensionsUsed.includes(extension)) {
          this.extensionsUsed.push(extension)
        }
      })
    }
    let materialExtension
    if (material.scale !== undefined || material.rotation !== undefined) {
      const scale = get(material, 'scale', 1)
      const rotation = get(material, 'rotation', 0)
      const offset = [0, 0]
      materialExtension = { offset, rotation, scale: [scale, scale] }
      this.extensionsUsed.push('KHR_texture_transform')
    }
    gltfMaterial.alphaMode = material.alpha_mode
    gltfMaterial.doubleSided = true

    if (material.normal_texture) {
      gltfMaterial.normalTexture = this.createTexture(material.normal_texture, materialExtension)
    }
    if (material.occlusion_texture) {
      gltfMaterial.occlusionTexture = this.createTexture(material.occlusion_texture, materialExtension)
    }
    if (material.emission_texture) {
      gltfMaterial.emissiveTexture = this.createTexture(material.emission_texture, materialExtension)
    }
    const defaultColor = new Array<number>(3).fill(1) as vec3
    gltfMaterial.pbrMetallicRoughness = {
      baseColorFactor: material.color
        ? [
            ...ColorUtils.hexToFactor<vec3>(Number(`0x${material.color.replace('#', '')}`), defaultColor),
            material.opacity,
          ]
        : undefined,
      baseColorTexture: this.createTexture(material.diffuse_texture, materialExtension),
      metallicRoughnessTexture: this.createTexture(material.metallic_roughness_texture, materialExtension),
      metallicFactor: material.metalness,
      roughnessFactor: material.roughness,
    }
    if (material.sheen || material.sheen_color || material.sheen_texture) {
      const extension: any = {}
      if (material.sheen) {
        extension.sheenRoughnessFactor = material.sheen
      }
      if (material.sheen_color) {
        extension.sheenColorFactor = ColorUtils.hexToFactor<vec3>(
          Number(`0x${material.sheen_color.replace('#', '')}`),
          defaultColor,
        )
      }
      if (material.sheen_texture) {
        extension.sheenColorTexture = this.createTexture(material.sheen_texture, materialExtension)
      }
      set(gltfMaterial, 'extensions.KHR_materials_sheen', extension)
      if (!this.extensionsUsed.includes('KHR_materials_sheen')) {
        this.extensionsUsed.push('KHR_materials_sheen')
      }
    }
    if (material.specular_texture) {
      const extension: any = {}
      extension.specularTexture = this.createTexture(material.specular_texture, materialExtension)
      set(gltfMaterial, 'extensions.KHR_materials_specular', extension)
      if (!this.extensionsUsed.includes('KHR_materials_specular')) {
        this.extensionsUsed.push('KHR_materials_specular')
      }
    }

    return gltfMaterial
  }

  createTexture(id?: string, extension?: any): Texture | undefined {
    if (id) {
      const texture: Texture = {
        index: this.textures.length,
      }
      if (extension) {
        set(texture, 'extensions.KHR_texture_transform', extension)
      }

      this.textures.push({
        sampler: 0,
        source: this.images.length,
      })

      this.images.push({ uri: `${getConfiguration().baseUrl}/media/${id}` })

      return texture
    }

    return undefined
  }
}
