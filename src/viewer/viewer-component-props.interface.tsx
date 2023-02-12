import type { PerspectiveCamera } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export interface ViewerComponentProps {
  camera: PerspectiveCamera
  onAfterRender?: () => void
  skybox?: string
  product?: GLTF
  environment?: GLTF
  loading: boolean
  showBehind?: boolean
}
