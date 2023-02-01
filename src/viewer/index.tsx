import { PerspectiveCamera } from 'three'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, Environment, Sky } from '@react-three/drei'

import type { ViewerProps } from './viewer-props.interface'
import { MaterialsRepository } from '../repositories'
import { getConfiguration } from '../configuration'
import { ModelMaterialConverter } from '../tools'
import { fitCameraToObject } from '../tools/camera'

export const Viewer = ({
  id,
  environment,
  width = 512,
  height = 512,
  skybox,
  materials,
  hidden,
  showBehind,
}: ViewerProps) => {
  const canvasStyle = { width, height, backgroundColor: 'red' }

  const controls = useRef<any>()
  const settings = getConfiguration()
  const [json, setJson] = useState<any>({})
  const [camera] = useState<any>(new PerspectiveCamera())
  const [productScene, setProductScene] = useState<GLTF>()
  const [product, setProduct] = useState<GLTF>()

  const productUrl = `${settings?.baseUrl}/previews/${id}?hide=${hidden?.join(';')}`
  const url = `${settings?.baseUrl}/previews/${id}?environment=${!!environment}&hide=${hidden?.join(';')}`

  useEffect(() => {
    if (productScene?.scene && product?.scene) {
      fitCameraToObject(camera, product.scene, controls.current)
    }
  }, [productScene, product, camera])

  useMemo(
    async () =>
      fetch(url)
        .then((response) => response.json())
        .then((model) => {
          setJson(model)
        }),
    [url],
  )
  useMemo(
    () => json && new GLTFLoader().parse(JSON.stringify(json), `${settings?.baseUrl}`, (i: GLTF) => setProductScene(i)),
    [json, settings],
  )

  useMemo(
    async () =>
      fetch(productUrl)
        .then((response) => response.json())
        .then((model) => {
          new GLTFLoader().parse(JSON.stringify(model), `${settings?.baseUrl}`, (i: GLTF) => setProduct(i))
        }),
    [productUrl, settings],
  )

  useEffect(() => {
    if (materials) {
      const entries = Object.entries(materials).filter((entry) => entry[1].material !== undefined)
      console.log('entries', entries)
      if (entries.length) {
        Promise.all(
          entries.map(async ([key, { material, ...data }]) => [
            key,
            await MaterialsRepository.generate(`${material}`, data),
          ]),
        ).then((results) => {
          const converter = new ModelMaterialConverter()
          const model = converter.applyAll(json, Object.fromEntries(results))
          console.log('model', model)
          setJson(model)
        })
      }
    }
  }, [materials])

  return (
    <Canvas style={canvasStyle} camera={camera} shadows>
      <ambientLight />
      <React.Suspense fallback={null}>{productScene && <primitive object={productScene.scene} />}</React.Suspense>
      <Environment files={skybox} />
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <OrbitControls
        ref={controls}
        enabled={true}
        minAzimuthAngle={showBehind ? -Infinity : -Math.PI / 4}
        maxAzimuthAngle={showBehind ? Infinity : Math.PI / 4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
        makeDefault
      />
      <axesHelper />
    </Canvas>
  )
}
