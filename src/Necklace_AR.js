import React, {Suspense, useRef, useState, useEffect, useCallback} from 'react';
import mergeImages from 'merge-images';
import axios from 'axios';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 (목부분에는 목걸이 모델이 보이지 않기 위함)

import {Model as Glasses} from './model/glasses' // 완료
import {Model as Glasses2} from './model/glasses2' // 완료
import {Model as Glasses3} from './model/glasses3' // 완료

import {Model as GoldChain} from './model/GoldChain' // 확인
import {Model as GoldNecklace} from './model/gold_necklace' // 확인
import {Model as GothicPendant} from './model/gothic_pendant' // 확인
import {Model as JashinNecklace} from './model/jashin_necklace' // 확인

import {Model as Earring} from './model/Earring' // 완료
import {Model as NestedPattern} from './model/nested_pattern' // 완료
import {Model as GoldLeaf} from './model/gold_leaf' // 완료
import {Model as SwanEarring} from './model/swan_earring' // 완료

//import { LineStrip } from 'three';

const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _expressions = null

let _temporary1 = 1 // 임의로 만든 변수

const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D  
  })

  function Select(){
    switch(_temporary1){
      case 1 : return <Glasses/>
      case 2 : return <Glasses2/>
      case 3 : return <Glasses3/>
      case 4 : return <GoldNecklace/>
      case 5 : return <GothicPendant/>
      case 6 : return <JashinNecklace/>
      case 7 : return <Earring/>
      case 8 : return <NestedPattern/>
      case 9 : return <GoldLeaf/>
      default:
        return null;
    }
  }
  
  return (
    <object3D ref={objRef}>
        <Suspense fallback={null}>
          <ambientLight/>
          <Head/>
          {Select()}
      </Suspense>
    </object3D>
  )}

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
  const mode = (height === wheight) ? 0 : 1 // 0 : 웹 , 1 : 폰

  // compute position of the canvas:
  const top = (mode === 0) ? 0 : "8%"
  const left = (wWidth - width) / 2

  return {width, height, top, left, mode, wheight, wWidth}
}

function App() {
  // init state:
  _expressions = []

  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized,setisInitialized] = useState(true)

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
  const getBase64StringFromDataURL = (dataURL) => {
    dataURL.replace('data:', '').replace(/^.+,/, '')
  };

  const dataURLtoFile = (dataurl, fileName) => {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }
  const todayTime = () => {
    let now = new Date().toString();
    return now;
  }

  const camera = useRef(null) // 카메라 입력
  const canvasRef = useRef(null) // 3D 모델 출력
  const pictureCanvasRef = useRef(null) // 임시로 카메라 입력받은거 canvas에 출력
  const [imageName, setImageName] = useState('');
  const [convertedFile2,setConvertedFile2] = useState();

  const snapshot = useCallback(() => {
    const canvas = pictureCanvasRef.current;

    canvas.getContext('2d').clearRect(0,0,sizing.width, sizing.height);
    canvas.getContext('2d').drawImage(canvasRef.current, 0, 0, sizing.width, sizing.height);

    let nowimageName = todayTime();
    setImageName(nowimageName);

    // 업로드 하는 코드x`
    mergeImages([
      camera.current.toDataURL('image/png'),
      canvas.toDataURL('image/png'),
    ]).then((b64) => {
      document.getElementById('preview').src = b64;
      console.log(b64);
      const convertedFile = dataURLtoFile(b64, todayTime() + ".png");
      console.warn(convertedFile);
      setConvertedFile2(convertedFile);
      console.warn(convertedFile2);
      const data = new FormData();
      data.append('file', convertedFile);

      let url = "/uploader";

      axios.post(url, data, {
        // 주소와 formdata를 posting 한다
     })
     .then(res => { 
       //상태 출력
         console.warn(res);
        //GuidePageClick();
     }).catch(err => {
       console.log(err);
     });
    })
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

  console.log(window.innerHeight)

  function GuidePageClick(e){window.location.href = "/GuidePage"}

  const [visible, setVisible] = useState(true);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(true);
  const [visible3, setVisible3] = useState(true);
  const [visible4, setVisible4] = useState(true);
  const [visible5, setVisible5] = useState(true);
  const [visible6, setVisible6] = useState(true);
  const [visible7, setVisible7] = useState(true);
  const [visible8, setVisible8] = useState(true);

  function testPage(num) {
    var i, tablinks;
    tablinks = document.getElementsByClassName("visible_button");
    for (i = 0; i < tablinks.length; i++) {
        if (i === num) { tablinks[i].style.opacity = "1";}
          else {tablinks[i].style.opacity = "0.35";}
    }
  }

  if (sizing.mode === 0) { // 0 : 출력화면이 가로가 길 경우
    return (
      <div id='camera_main'>     
        <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
            gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
              <DirtyHook sizing={sizing} />
              <FaceFollower faceIndex={0} expression={_expressions[0]} />
        </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}

      <div className = "camera_mamu_0" style={{top : 0, left : (sizing.left * (window.innerWidth / sizing.wWidth) + sizing.width)}}>  {/* 메뉴 */}
      
        <div style={{zIndex: 2, height: "100%", width: "1.5vw", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list_0" style={{top : 0, width: window.innerWidth * 0.075, height: '100%'}}> {/* 모델 리스트 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 1}}
            onClick = {() => {testPage(0); setVisible(true); if(visible) {_temporary1 = 1; setVisible(false)}}}> <img src = 'glasses1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(1); setVisible1(true); if(visible1) {_temporary1 = 2; setVisible1(false)}}}> <img src = 'glasses2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(2); setVisible2(true); if(visible2) {_temporary1 = 3; setVisible2(false)}}}> <img src = 'glasses3.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(3); setVisible3(true); if(visible3) {_temporary1 = 4; setVisible3(false)} }}> <img src = 'necklace1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(4); setVisible4(true); if(visible4) {_temporary1 = 5; setVisible4(false)} }}> <img src = 'necklace2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(5); setVisible5(true); if(visible5) {_temporary1 = 6; setVisible5(false)} }}> <img src = 'necklace3.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(6); setVisible6(true); if(visible6) {_temporary1 = 7; setVisible6(false)} }}> <img src = 'earring1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(7); setVisible7(true); if(visible7) {_temporary1 = 8; setVisible7(false)} }}> <img src = 'earring2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(8); setVisible8(true); if(visible8) {_temporary1 = 9; setVisible8(false)} }}> <img src = 'earring3.png' height = {'100%'} wheight = {'100%'} /> </button>            
        </div>
        
        <div className = "snap_0"> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075}} onClick={snapshot}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>

      </div>

      <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, left : window.innerWidth - 150}} onClick = {GuidePageClick}> 다음 페이지로 이동 </button>
    </div>
    )}

  else {
    return (
    <div id='camera_main_0'>  
      <div className = "Title_img"> 
        <div style={{padding: "1% 5% 1% 5%", fontSize : '20px'}}/>
      </div>
      
      <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
          gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
            <DirtyHook sizing={sizing} />
            <FaceFollower faceIndex={0} expression={_expressions[0]} />
      </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}
      
      <div className = "camera_mamu" style={{top : sizing.height}}>  {/* 메뉴 */}

        <div style={{zIndex: 2, height: "4vh", width: "100%", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list" style={{width: "auto", height: "auto", overflow : "auto"}}> {/* 모델 리스트 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 1}}
            onClick = {() => {testPage(0); setVisible(true); if(visible) {_temporary1 = 1; setVisible(false)}}}> <img src = 'glasses1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(1); setVisible1(true); if(visible1) {_temporary1 = 2; setVisible1(false)}}}> <img src = 'glasses2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(2); setVisible2(true); if(visible2) {_temporary1 = 3; setVisible2(false)}}}> <img src = 'glasses3.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(3); setVisible3(true); if(visible3) {_temporary1 = 4; setVisible3(false)}}}> <img src = 'necklace1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(4); setVisible4(true); if(visible4) {_temporary1 = 5; setVisible4(false)}}}> <img src = 'necklace2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(5); setVisible5(true); if(visible5) {_temporary1 = 6; setVisible5(false)}}}> <img src = 'necklace3.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(6); setVisible6(true); if(visible6) {_temporary1 = 7; setVisible6(false)}}}> <img src = 'earring1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(7); setVisible7(true); if(visible7) {_temporary1 = 8; setVisible7(false)}}}> <img src = 'earring2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {testPage(8); setVisible8(true); if(visible8) {_temporary1 = 9; setVisible8(false)}}}> <img src = 'earring3.png' height = {'100%'} wheight = {'100%'} /> </button>
        </div>
        
        <div className = "snap"> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}} onClick={snapshot}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>

      </div>
      
      <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, top : window.innerHeight - 50}} onClick = {GuidePageClick}> 다음 페이지로 이동 </button>
    </div>
  )}  
};

export {App as default};