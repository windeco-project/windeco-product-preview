import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { MaterialSetup } from '../material/types'
import { getConfiguration } from '../configuration'
import { MaterialsRepository, PreviewsRepository } from '../repositories'
import { ModelMaterialConverter } from '../tools'

export const LoadModelFromApi = (
  id: string,
  type: 'product' | 'environment',
  callback: (object: GLTF) => void,
  hidden?: string[],
  materials?: Record<string, MaterialSetup>,
) => {
  const { baseUrl } = getConfiguration()
  PreviewsRepository[type](id, hidden)
    .then((json: string) => {
      const entries = Object.entries(materials || {}).filter((entry) => entry[1].material !== undefined)
      if (type === 'product' && entries.length > 0) {
        return Promise.all(
          entries.map(async ([key, { material, ...data }]) => [
            key,
            await MaterialsRepository.generate(`${material}`, data),
          ]),
        )
          .then((results) => {
            const converter = new ModelMaterialConverter()
            const model = converter.applyAll(json, Object.fromEntries(results))
            console.log('model', model)
            return JSON.stringify(model)
          })
          .catch(() => JSON.stringify(json))
      }
      return JSON.stringify(json)
    })
    .then((json: string) => new GLTFLoader().parse(json, `${baseUrl}`, (i: GLTF) => callback(i)))
}
