import axios, { AxiosInstance } from 'axios'

import { getConfiguration } from '../configuration'

export const getClient = (): AxiosInstance =>
  axios.create({
    baseURL: getConfiguration().baseUrl,
  })
