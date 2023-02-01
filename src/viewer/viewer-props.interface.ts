import { MaterialSetup } from '../material/types'

export interface ViewerProps {
  id: string
  width?: number
  height?: number
  skybox?: string
  hidden?: string[]
  environment?: boolean
  showBehind?: boolean
  materials?: Record<string, MaterialSetup>
}
