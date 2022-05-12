import React, {Suspense, useRef, useState, useEffect, useCallback} from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'
import mergeImages from 'merge-images';

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 (목부분에는 목걸이 모델이 보이지 않기 위함)

import {Model as GoldChain} from './model/GoldChain' // 확인
import {Model as Earring} from './model/Earring' // 완료
import {Model as GoldNecklace} from './model/gold_necklace' // 확인
import {Model as GothicPendant} from './model/gothic_pendant' // 확인
import {Model as JashinNecklace} from './model/jashin_necklace' // 확인
import {Model as ChristmasHat} from './model/ChristmasHat2.js' // 크리스마스 모자 (위치 수정 완료)
import {Model as BeanieHat} from './model/BeanieHat.js' // 비니모자 (위치 수정 완료)
import {Model as Hat1} from './model/Hat.js' // 처마가 넓은 모자 (위치 수정 완료)

// 목걸이 3D 모델

const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _temporary1 = 0 // 임의로 만든 변수
let _temporary2 = false // 임의로 만든 변수
const _temporary3 = 1 // 임의로 만든 변수

let _expressions = null
const FaceFollower0 = (props) => {
  
  
  return (
     
      <Earring/>


  ) 
}
const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()

  function SelectHat(){
    switch(_temporary1){
      case 1 : return <Hat1/>
      case 2 : return <BeanieHat/>
      case 3 : return <ChristmasHat/>
      default:
        return null;
    }

}
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D  
    console.log(_temporary1)
    console.log(_temporary2)
  })
  
  return (
    <object3D ref={objRef} >
      <Suspense fallback={null}>
      <ambientLight/>
       {SelectHat()}
      {_temporary2 && <GoldChain/> }
      <Head/>
      </Suspense>
    </object3D>

  ) 
}
const FaceFollower2 = (props) => {
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
  const height = (window.innerHeight) * 0.50
  const width = (window.innerWidth) * 0.50

  // compute position of the canvas:
  const top = 0
  const left = (window.innerWidth) * 0.25
  
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

  const camera = useRef(null) // 카메라 입력
  const canvasRef = useRef(null) // 3D 모델 출력
  const pictureCanvasRef = useRef(null) // 임시로 카메라 입력받은거 canvas에 출력
  const [visible1,setVisible1] = useState(true);
  const [visible2,setVisible2] = useState(true);
  const [visible3,setVisible3] = useState(true);

  
  const Hats = [<Hat1/>,<BeanieHat/>,<ChristmasHat/>];
  const Necklace = [];
  const snapshot = useCallback(() => {
    const canvas = pictureCanvasRef.current; // 연결
    canvas.getContext('2d').drawImage(camera.current, 0, 0); // 입력된 카메라 이미지 pictureCanvasRef에 그리기

    mergeImages([
      //canvas.toDataURL('image/png'), // 살려줘 아니 왜 1/2로 줄어드냐 씹 -> 이거 때문에 이미지 병합 못함
      canvasRef.current.toDataURL('image/png'), 
    ]).then(b64 => document.querySelector('img').src = b64) // 이미지 병합한거 추가 라고 하지만 3d 모델만 저장
  })

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
      <Canvas className='mirrorX' ref={canvasRef} style={{
        position: 'fixed',
        zIndex: 1,
        ...sizing
      }} 
      width = {sizing.width} height = {sizing.height} 
      gl={{ preserveDrawingBuffer: true // allow image capture
      }}
      updatedefaultcamera = "false">
        <DirtyHook sizing={sizing} />

        <FaceFollower faceIndex={0} expression={_expressions[0]} />
       
    </Canvas>
  
    <canvas className='mirrorX' ref={camera} style={{
        position: 'fixed',
        zIndex: 0,
        ...sizing
      }} width = {sizing.width} height = {sizing.height}
    />
    <img className = "snap" style={{
        position: 'fixed',
        zIndex: 1, // z축이 높아서 덮어씌워지게 보이는거 
        top : (window.innerHeight) * 0.5,
        left : (window.innerWidth) * 0.25
      }} width = {sizing.width} height = {sizing.height} // 여기서 3d 모델만 저장된 이미지 출력 댐 
      /> 

    <canvas className = "snap" ref={pictureCanvasRef} style={{
        position: 'fixed',
        zIndex: 0,
        top : (window.innerHeight) * 0.5,
        left : (window.innerWidth) * 0.25
      }} width = {sizing.width} height = {sizing.height} 
      />

    <button className = "snap_button" style={{
      position: 'fixed',
      zIndex: 2,
      height: (window.innerWidth) * 0.2,
      width: (window.innerWidth) * 0.2,
      top : (window.innerHeight) * 0.4,
      left : (window.innerWidth) * 0.025
      }} onClick={snapshot}> </button>

      
      <button className = "snap_button" style={{
        /*여기에서 버튼을 통해 불러오기 각각 불러오기 시도 하려고 했으나 일부분 짤리는 현상 발생 */
      position: 'fixed',
      zIndex: 2,
      height: (window.innerWidth) * 0.1,
      width: (window.innerWidth) * 0.1,
      top : (window.innerHeight) * 0.05,
      left : (window.innerWidth) * 0.025
      // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
      }} onClick= {() => {
        setVisible1(!visible1)
        if(visible1)
        {
          _temporary1 = 1
          setVisible2(false)
        }
        else
        {
          
          _temporary1 = 0
        }
      }}>
         {visible1 ? "모자 보이는 상태 1" : "모자 숨겨진 상태1"} </button>

         <button className = "snap_button" style={{
        /*여기에서 버튼을 통해 불러오기 각각 불러오기 시도 하려고 했으나 일부분 짤리는 현상 발생 */
      position: 'fixed',
      zIndex: 2,
      height: (window.innerWidth) * 0.1,
      width: (window.innerWidth) * 0.1,
      top : (window.innerHeight) * 0.23,
      left : (window.innerWidth) * 0.025
      // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
      }} onClick= {() => {
        setVisible2(!visible2)
        if(visible2)
        {
          _temporary1 = 2
          setVisible1(false)
        }
        else
        {
          _temporary1= 0
        }
      }}>
         {visible2 ? "모자 보이는 상태 2" : "모자 숨겨진 상태2"} </button>


      <button className = "snap_button" style={{
      position: 'fixed',
      zIndex: 2,
      height: (window.innerWidth) * 0.1,
      width: (window.innerWidth) * 0.1,
      top : (window.innerHeight) * 0.8,
      left : (window.innerWidth) * 0.025
      }} onClick= {() => {
        setVisible3(!visible3)
        _temporary3 = visible3
      }}> {visible3 ? "목걸이 보여진 상태2" : "목걸이 숨겨진 상태2"} </button>
      
    </div>
  )  
};

export default App;