import { MaterialInterface } from '../repositories/types'

export interface MaterialProps {
  entity: MaterialInterface
  fields?: Partial<MaterialInterface>
}
