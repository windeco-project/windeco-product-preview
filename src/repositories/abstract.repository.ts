import LZString from 'lz-string'
import { AxiosInstance } from 'axios'

import { EntitiesList, getClient } from '../tools'
import { DeleteResponseInterface } from './types/delete-response.interface'

export class AbstractRepository<T, P extends object> {
  constructor(protected readonly base: string) {}

  protected get client(): AxiosInstance {
    return getClient()
  }

  protected toFormData(data: object) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  }

  protected encode(data: Record<string, string | number>) {
    return LZString.compressToEncodedURIComponent(JSON.stringify(data))
  }

  list(
    page = 0,
    limit = 5,
    filter?: Record<string, string>,
    sort?: Record<string, 'desc' | 'asc'>,
  ): Promise<EntitiesList<T>> {
    const params = this.encode(JSON.parse(JSON.stringify({ page, limit, filter, sort })))
    return this.client.get(this.base, { params }).then(({ data }) => data)
  }

  create(data: P): Promise<T> {
    return this.client.post(this.base, this.toFormData(data)).then(({ data }) => data)
  }

  get(id: string): Promise<T> {
    return this.client.get(`${this.base}/${id}`).then(({ data }) => data)
  }

  post(id: string): Promise<T> {
    return this.client.get(`${this.base}/${id}`).then(({ data }) => data)
  }

  patch(id: string, data: P): Promise<T> {
    return this.client.patch(`${this.base}/${id}`, this.toFormData(data)).then(({ data }) => data)
  }

  delete(id: string): Promise<DeleteResponseInterface> {
    return this.client.delete(`${this.base}/${id}`).then(({ data }) => data)
  }
}
