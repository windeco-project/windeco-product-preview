/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber'
import React, { useMemo, useState } from 'react'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { BakeShadows, OrbitControls, Environment } from '@react-three/drei'

import { ModelMaterialConverter } from '../tools'
import type { MaterialProps } from './material-props.interface'

const converter = new ModelMaterialConverter()

export const Material = ({ entity, fields }: MaterialProps) => {
  const [json, setJson] = useState<any>({})
  const [object, setObject] = useState<GLTF>()
  const url = `/assets/${entity.is_cloth ? 'cloth' : 'sphere'}.gltf`
  useMemo(
    async () =>
      fetch(url)
        .then((response) => response.json())
        .then((model) => {
          setJson(converter.apply(model, entity, fields))
        }),
    [entity, fields, url],
  )
  useMemo(() => json && new GLTFLoader().parse(JSON.stringify(json), '/assets/', (i) => setObject(i)), [json])

  object?.scene.traverse((o: any) => {
    if (fields && o.isMesh) {
      o.material = converter.applyTextures(o.material, fields)
      console.log('o.material', o.material)
    }
  })

  return (
    <Canvas style={canvasStyle} camera={{ position: [-1.5, 0, 0], fov: 30 }}>
      <React.Suspense fallback={null}>
        {object && <primitive object={object.scene} />}
        <Environment preset='city' />
      </React.Suspense>
      <BakeShadows />
      <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}

Material.displayName = 'Material'

const canvasStyle = {
  width: '100%',
  height: 'auto',
  aspectRatio: 1,
}
