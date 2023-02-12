import React, {
  CSSProperties,
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import Lottie from 'lottie-react'
import { Canvas } from '@react-three/fiber'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import LoadingAnimation from './loader.json'
import { LoadModelFromApi } from './load-model'
import { ViewerComponent } from './viewer-component'
import { ViewerProps } from './viewer-props.interface'
import { PerspectiveCamera } from 'three'

type ModelType = ['product' | 'environment', Dispatch<SetStateAction<GLTF | undefined>>][]

export const Viewer = forwardRef(
  (
    { id, environment: withEnvironment, width = 512, height = 512, skybox, materials, hidden, showBehind }: ViewerProps,
    ref,
  ) => {
    const canvas = useRef<any>()
    const viewComponent = useRef<any>()

    const [product, setProduct] = useState<GLTF | undefined>()
    const [environment, setEnviroment] = useState<GLTF | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [camera] = useState<any>(new PerspectiveCamera())

    const loadModel = useCallback(LoadModelFromApi, [id, hidden])
    const styles = stylesBuilder(width, height, loading)

    useMemo(async () => {
      setLoading(true)
      const types: ModelType = [['product', setProduct]]
      if (withEnvironment) {
        types.push(['environment', setEnviroment])
      }
      Promise.all(types.map(([type, callback]) => loadModel(id, type, callback, hidden, materials))).finally(() =>
        setLoading(false),
      )
    }, [hidden, id, loadModel, materials, withEnvironment])

    useImperativeHandle(ref, () => ({
      screenshot() {
        return new Promise((resolve) => {
          canvas.current.toBlob(resolve)
        })
      },
      resetView() {
        viewComponent.current.resetView()
      },
    }))

    return (
      <div style={styles.container}>
        <Canvas
          ref={canvas}
          style={styles.canvas}
          camera={camera}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
          }}
          shadows
        >
          <ViewerComponent
            ref={viewComponent}
            camera={camera}
            skybox={skybox}
            product={product}
            loading={loading}
            showBehind={showBehind}
            environment={withEnvironment ? environment : undefined}
          />
        </Canvas>
        {loading && <Lottie animationData={LoadingAnimation} style={styles.loader} />}
      </div>
    )
  },
)

Viewer.displayName = 'Viewer'

const stylesBuilder = (width: number, height: number, loading: boolean): Record<string, CSSProperties> => ({
  container: { position: 'relative', width, height, overflow: 'hidden' },
  canvas: {
    width,
    height,
    filter: loading ? 'grayscale(100%) blur(2px) brightness(0.67)' : undefined,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    top: '50%',
    translate: '-50% -50%',
    width: Math.round(width / 2),
  },
})
