import { OrbitControls } from 'three-stdlib'
import { Box3, Object3D, PerspectiveCamera, Vector3 } from 'three'

export const fitCameraToObject = (camera: PerspectiveCamera, object: Object3D, controls?: OrbitControls) => {
  const boundingBox = new Box3().setFromObject(object)

  const size = new Vector3()
  boundingBox.getSize(size)

  const center = new Vector3()
  boundingBox.getCenter(center)

  const fov = camera.fov * (Math.PI / 180)
  const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect)
  const dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2))
  const dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2))
  const cameraZ = Math.max(dx, dy)

  camera.position.set(0, center.y, center.z + cameraZ)
  controls?.target.set(0, center.y, 0)
  controls?.update()
  camera.updateProjectionMatrix()

  return camera
}
