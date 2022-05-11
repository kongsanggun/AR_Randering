import React, {Suspense, useRef, useState, useEffect} from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 (목부분에는 목걸이 모델이 보이지 않기 위함)

import {Model as GoldChain} from './model/GoldChain' // 확인
import {Model as Earring} from './model/Earring' // 완료
import {Model as GoldNecklace} from './model/gold_necklace' // 확인
import {Model as GothicPendant} from './model/gothic_pendant' // 확인
import {Model as JashinNecklace} from './model/jashin_necklace' // 확인
import {Model as Hat1} from './model/Hat.js' // 처마가 넓은 모자 (위치 수정 완료)

// 목걸이 3D 모델

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
      <Hat1/>
      <GoldChain/>
      <Earring/>
      <Head/>
      </Suspense>
    </object3D>

  ) 
}

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

  const height = (window.innerHeight) * 0.7
  const width = (window.innerWidth) * 0.4

  // compute position of the canvas:
  const top = 0
  const left = (window.innerWidth) * 0.4
  
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

      <button className = "buttontransfer" style={{
        position: 'fixed',
        zIndex: 2}}> 모자 AR 렌더링 페이지 </button>
    </div>
  )  
};

export default App;