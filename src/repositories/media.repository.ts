import { MediumFormData, MediumInterface } from './types'
import { AbstractRepository } from './abstract.repository'
import { MediumCategory } from './enums'
import { ColorResponse } from './types/color-response.interface'

class MediaRepositoryClass extends AbstractRepository<MediumInterface, MediumFormData> {
  constructor() {
    super('media')
  }

  create(): Promise<MediumInterface> {
    throw new Error('This method is disabled in this repository, please use the upload method to create a new medium.')
  }

  upload(category: MediumCategory, data: MediumFormData): Promise<MediumInterface> {
    return this.client.post(`${this.base}/${category}`, this.toFormData(data)).then(({ data }) => data)
  }

  get(id: string): Promise<MediumInterface> {
    return this.client.get(`${this.base}/${id}/details`).then(({ data }) => data)
  }

  getColor(media: File): Promise<ColorResponse> {
    return this.client.post(`${this.base}/average`, this.toFormData({ media })).then(({ data }) => data)
  }
}

export const MediaRepository = new MediaRepositoryClass()
