import type { Configuration } from './configuration.interface'
export * from './configuration.interface'

const settings: Configuration = {}

export const getConfiguration = () => settings

export const setBaseUrl = (url: string) => {
  settings.baseUrl = url
}
