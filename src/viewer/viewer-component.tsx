import { forwardRef, Suspense, useCallback, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { Object3D } from 'three'
import { Environment, OrbitControls, Sky } from '@react-three/drei'

import { ViewerComponentProps } from './viewer-component-props.interface'
import { fitCameraToObject } from '../tools/camera'
import React from 'react'

// eslint-disable-next-line react/display-name
export const ViewerComponent = forwardRef(
  ({ loading, product, camera, environment, skybox, showBehind }: ViewerComponentProps, ref) => {
    const isLoading = loading || !product

    const controls = useRef<any>()

    const fitCamera = useCallback(
      (object: Object3D) => {
        fitCameraToObject(camera, object, controls.current)
        console.log('position', camera.position)
      },
      [camera, controls],
    )

    useLayoutEffect(() => {
      if (!isLoading && product?.scene) {
        fitCamera(product.scene)
      }
    }, [fitCamera, isLoading, product])

    useImperativeHandle(ref, () => ({
      resetView() {
        if (!isLoading && product?.scene) {
          fitCamera(product.scene)
        }
      },
    }))

    return (
      <>
        <ambientLight />
        <Suspense fallback={null}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          {!isLoading && product && <primitive object={product.scene} renderOrder={1} receiveShadow />}
          {/* eslint-disable-next-line react/no-unknown-property */}
          {!isLoading && environment && <primitive object={environment.scene} renderOrder={2} receiveShadow />}
          <Environment files={skybox} background />
        </Suspense>
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
        <OrbitControls
          minAzimuthAngle={showBehind ? -Infinity : -Math.PI / 4}
          maxAzimuthAngle={showBehind ? Infinity : Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 3}
          minPolarAngle={Math.PI / 3}
          enabled={!isLoading}
          ref={controls}
          makeDefault
        />
      </>
    )
  },
)
