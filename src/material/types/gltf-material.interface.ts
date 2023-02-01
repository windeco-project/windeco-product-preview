export interface GlTFProperty {
  extensions?: {
    [k: string]: {
      [k: string]: unknown
    }
  }
  extras?: {
    [k: string]: unknown
  }
}

export interface Texture extends GlTFProperty {
  index: number
  texCoord?: number
}

export interface GLTFMaterial extends GlTFProperty {
  name?: string
  emissiveFactor?: [number, number, number]
  alphaMode?: 'OPAQUE' | 'MASK' | 'BLEND' | string
  alphaCutoff?: number
  doubleSided?: boolean
  pbrMetallicRoughness?: GlTFProperty & {
    baseColorFactor?: [number, number, number, number]
    baseColorTexture?: Texture
    metallicFactor?: number
    roughnessFactor?: number
    metallicRoughnessTexture?: Texture
  }
  normalTexture?: GlTFProperty &
    Texture & {
      scale?: number
    }
  occlusionTexture?: GlTFProperty &
    Texture & {
      strength?: number
    }
  emissiveTexture?: Texture
}
