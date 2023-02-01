import { MaterialFormData, MaterialInterface } from './types'
import { MaterialGenerationData } from '../material/types'
import { AbstractRepository } from './abstract.repository'

class MaterialsRepositoryClass extends AbstractRepository<MaterialInterface, MaterialFormData> {
  constructor() {
    super('materials')
  }

  generate(id: string, params: MaterialGenerationData): Promise<MaterialInterface> {
    return this.client.get(`${this.base}/${id}/generate`, { params }).then(({ data }) => data)
  }
}

export const MaterialsRepository = new MaterialsRepositoryClass()
