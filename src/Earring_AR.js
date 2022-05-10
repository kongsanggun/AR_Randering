import React, {Suspense, useRef, useState, useEffect} from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 

import {Model as Earring} from './model/Earring' // 완료
import {Model as NestedPattern} from './model/nested_pattern' // 완료
import {Model as GoldLeaf} from './model/gold_leaf' // 완료
import {Model as SwanEarring} from './model/swan_earring' // 완료

// 귀걸이 3D 모델 -> 반측면을 기준으로 함

const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _expressions = null

const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D  
  })
  
  return (
    <object3D ref={objRef}>
      <Suspense fallback={null}>
      <ambientLight/>
      <Earring/>
      </Suspense>
    </object3D>
  ) // 여기 안에서 모델 변경해주면 댐
} // 모델 출력

let _threeFiber = null
const DirtyHook = (props) => {
  _threeFiber = useThree()
  useFrame(JeelizThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}

const compute_sizing = () => {
  // compute  size of the canvas:
  const wheight = (window.innerHeight)
  const wWidth = (window.innerWidth)

  const height = Math.min(wWidth, wheight) 
  const width = Math.min(wWidth, wheight)

  // compute position of the canvas:
  const top = 0
  const left = (wWidth - width ) / 2
  
  return {width, height, top, left}
}

function App() {
  // init state:
  _expressions = []

  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized] = useState(true)

  let _timerResize = null
  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }

  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }

  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize()
    }    
  }, [sizing])

  const callbackReady = (errCode, spec) => {
    if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode)
      return
    }

    console.log('INFO: JEELIZFACEFILTER IS READY')
    // there is only 1 face to track, so 1 face follower:
    JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)    
  }

  const callbackTrack = (detectStatesArg) => {
    // if 1 face detection, wrap in an array:
    const detectStates = (detectStatesArg.length) ? detectStatesArg : [detectStatesArg]

    // update video and THREE faceFollowers poses:
    JeelizThreeFiberHelper.update(detectStates, _threeFiber.camera)

    // render the video texture on the faceFilter canvas:
    JEELIZFACEFILTER.render_video()

    // get expressions factors:
    detectStates.forEach((detectState, faceIndex) => {
    })    
  }

  const callbackDetect = (faceIndex, isDetected) => {
    if (isDetected) {
      console.log('DETECTED')
    } else {
      console.log('LOST')
    }
  }

  const camera = useRef(null)

  useEffect(() => {
    window.addEventListener('resize', handle_resize)
    window.addEventListener('orientationchange', handle_resize)

    JEELIZFACEFILTER.init({
      canvas: camera.current,
      NNC: NN_4EXPR,
      maxFacesDetected: 1,
      followZRot: true,
      callbackReady,
      callbackTrack
    })
    return JEELIZFACEFILTER.destroy
  }, [isInitialized])

  console.log('RENDER')

  return (
    <div>
      <Canvas className='mirrorX' ref={camera} style={{
        position: 'fixed',
        zIndex: 1,
        ...sizing
      }} 
      width = {sizing.width} height = {sizing.height} 
      gl={{ preserveDrawingBuffer: true // allow image capture
      }}
      updateDefaultCamera = {true}>
        <DirtyHook sizing={sizing} />
        <FaceFollower faceIndex={0} expression={_expressions[0]} />
    </Canvas>
  
    <canvas className='mirrorX' ref={camera} style={{
        position: 'fixed',
        zIndex: 0,
        ...sizing
      }} width = {sizing.width} height = {sizing.height} />
    </div>
  )  
};

export default App;