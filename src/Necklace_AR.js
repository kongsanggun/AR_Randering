import React, {Suspense, useRef, useState, useEffect, useCallback} from 'react';
import mergeImages from 'merge-images';
import axios from 'axios';

import "./App.css";
import "./loading.css"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 (목부분에는 목걸이 모델이 보이지 않기 위함)

// 각각 모델들을 가져왔습니다. 
// 위에서 부터 안경, 목걸이, 귀걸이 총 3가지 방향으로 진행하였습니다.

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

let glasses_mode = 0 // 안경 변수
let necklace_mode = 0 // 목걸이 변수
let earring_mode = 0 // 귀걸이 변수

const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D  
  })

  // 버튼 작동하는 기능들 목걸이간, 귀걸이간, 안경간 중복되지 않게 누를수 있게 구현
  function G_Select(){
    switch(glasses_mode){
      case 1 : return <Glasses/>
      case 2 : return <Glasses2/>
      case 3 : return <Glasses3/>
      default:
        return null;
    }
  }
  
  function N_Select(){
    switch(necklace_mode){
      case 1 : return <GoldNecklace/>
      case 2 : return <GothicPendant/>
      case 3 : return <JashinNecklace/>
      default:
        return null;
    }
  }

  function E_Select(){
    switch(earring_mode){
      case 1 : return <Earring/>
      case 2 : return <NestedPattern/>
      case 3 : return <GoldLeaf/>
      default:
        return null;
    }
  }

  return (
    <object3D ref={objRef}>
        <Suspense fallback={null}>
          <ambientLight/>
          <Head/>
          {G_Select()}
          {N_Select()}
          {E_Select()}
      </Suspense>
    </object3D>
  )}

let _threeFiber = null

const DirtyHook = (props) => {
  _threeFiber = useThree()
  useFrame(JeelizThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}

// 사이즈를 조정해서 폰일 경우와 웹일 경우를 구별
const compute_sizing = () => {
  // compute  size of the canvas:
  const wheight = (window.innerHeight)
  const wWidth = (window.innerWidth)

  const height = Math.min(wWidth, wheight) 
  const width = Math.min(wWidth, wheight)
  // height, weight 1:1기준으로 하여 진행하였다.
  const mode = (height === wheight) ? 0 : 1 // 0 : 웹 , 1 : 폰

  // compute position of the canvas:
  const top = (mode === 0) ? 0 : "8%"
  const left = (wWidth - width) / 2
  // 나머지 값들 다 return
  return {width, height, top, left, mode, wheight, wWidth}
}


// 메인 app function 시작
function App() {
  // init state:
  _expressions = []

  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized,setisInitialized] = useState(true)

  let _timerResize = null
  // 시간마다 랜더링 되는 모델 자동 리사이징
  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }

  // 
  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }
  // useeffect 로 return 한다
  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize()
    }    
  }, [sizing])


  // 카메라 로딩 되면서 준비 되었는지 확인되는 함수
  const callbackReady = (errCode, spec) => {
    if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode)
      return
    }
    
    console.log('INFO: JEELIZFACEFILTER IS READY')
    // there is only 1 face to track, so 1 face follower:
    JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)
    // 로딩되면 카메라로 return
    Endloading();
  }
  // tracking 하기 위한 함수들
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

  // 랜더링 되기 위한 얼굴을 detect 하였는지 확인하기 위한 함수
  const callbackDetect = (faceIndex, isDetected) => {
    if (isDetected) {
      console.log('DETECTED')
    } else {
      console.log('LOST')
    }
  }
  //  dataurl 를 base64로 받기 위한 함수 (사용 안함)
  const getBase64StringFromDataURL = (dataURL) => {
    dataURL.replace('data:', '').replace(/^.+,/, '')
  };


  // dataurl를 file 형식으로 받기 위한 함수
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

  // 현재 시간 출력 한국 기준
  const todayTime = () => {
    let now = new Date().toString();
    return now;
  }

  
  const camera = useRef(null) // 카메라 입력
  const canvasRef = useRef(null) // 3D 모델 출력
  const pictureCanvasRef = useRef(null) // 임시로 카메라 입력받은거 canvas에 출력
  const [imageName, setImageName] = useState('');
  const [convertedFile2,setConvertedFile2] = useState();

  // snapshot 콜백 함수 canvas 형태로 해서 그려서 붙이는 방식
  const snapshot = useCallback(() => {
    const canvas = pictureCanvasRef.current;

    canvas.getContext('2d').clearRect(0,0,sizing.width, sizing.height);
    canvas.getContext('2d').drawImage(canvasRef.current, 0, 0, sizing.width, sizing.height);

    let nowimageName = todayTime();
    setImageName(nowimageName);

    // 업로드 하는 코드x` , 사진과 랜더링 된 사진 mergeing 하는 함수
    mergeImages([
      camera.current.toDataURL('image/png'),
      canvas.toDataURL('image/png'),
    ]).then((b64) => {
      // 여기가 중요한데 b64 형태가 base64 형태 코드로 해서 mergeing 한걸 받음
      // 그다음 file 형태로 만들어서 서버로 보내는 방식으로 구현하였다.
      document.getElementById('preview').src = b64;
      console.log(b64);
      const convertedFile = dataURLtoFile(b64, todayTime() + ".png");
      console.warn(convertedFile);
      setConvertedFile2(convertedFile);
      console.warn(convertedFile2);
      const data = new FormData();
      data.append('file', convertedFile);
      // 플라스크 uploader 참조 사진 보내면 서버에서 저장한다.
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
  
  //윈도우 크기 확인하여 ui 나 기타 등등 변경하게 만든다.
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


  // 높이 확인하여 웹인지 앱인지 확인
  console.log(window.innerHeight)

  // 다음 페이지 , 즉 GuidePage 로 이동 되게 구현하였다.
  function GuidePageClick(e){window.location.href = "/GuidePage"}

  // endloading 되면 style 죽이고 return 
  function Endloading(e) {
    const element = document.getElementById("loading");
    element.style.display = 'none';
  }
  // 사진 찍도록 구현하였다.
  function ClickSnap(e) {
    const element = document.getElementById("snaped");
    element.classList.remove("snap_active");
    element.classList.add("snap_active"); 
  } // 찰칵 효과

  // 버튼 visible 유무
  const [all_reset, set_all_reset] = useState(true);

  const [G_reset, set_G_reset] = useState(true);
  const [visible, setVisible] = useState(true);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(true);

  const [N_reset, set_N_reset] = useState(true);
  const [visible3, setVisible3] = useState(true);
  const [visible4, setVisible4] = useState(true);
  const [visible5, setVisible5] = useState(true);

  const [E_reset, set_E_reset] = useState(true);
  const [visible6, setVisible6] = useState(true);
  const [visible7, setVisible7] = useState(true);
  const [visible8, setVisible8] = useState(true);

  // 버튼 구현 22
  function Page(num) {
    var i, tablinks;
    tablinks = document.getElementsByClassName("visible_button");

    if (num === 0) {
      for (i = 0; i < tablinks.length; i++) {
        if (i === num) { tablinks[i].style.opacity = "1";}
          else {tablinks[i].style.opacity = "0.35";}
      }
    }
    else if (num < 5) {
      tablinks[0].style.opacity = "0.35";
      for (i = 1; i < 5; i++) {
        if (i === num) { tablinks[i].style.opacity = "1";}
          else {tablinks[i].style.opacity = "0.35";}
      }
    }
    else if(num < 9) {
      tablinks[0].style.opacity = "0.35";
      for (i = 5; i < 9; i++) {
        if (i === num) { tablinks[i].style.opacity = "1";}
          else {tablinks[i].style.opacity = "0.35";}
      }
    }
    else {
      tablinks[0].style.opacity = "0.35";
      for (i = 9; i < tablinks.length; i++) {
        if (i === num) { tablinks[i].style.opacity = "1";}
          else {tablinks[i].style.opacity = "0.35";}
      }
    }
  }

  if (sizing.mode === 0) { // 0 : 출력화면이 가로가 길 경우
    return (
      <div id='camera_main'>
        <div id = 'loading' style={{position: 'absolute', zIndex: 5, ...sizing}} width = {sizing.width} height = {sizing.height}> 
            <div className="loading-css"></div>
            <div id="loading-text">loading</div>
        </div>
        <div id = 'snaped' style={{position: 'absolute', zIndex: 4, ...sizing}} width = {sizing.width} height = {sizing.height}> </div>    
        <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
            gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
              <DirtyHook sizing={sizing} />
              <FaceFollower faceIndex={0} expression={_expressions[0]} />
        </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" src = 'ready.png' style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}

      <div className = "camera_mamu_0" style={{top : 0, left : (sizing.left * (window.innerWidth / sizing.wWidth) + sizing.width)}}>  {/* 메뉴 */}
        <div style={{zIndex: 2, height: "100%", width: "1.5vw", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list_0" style={{top : 0, width: window.innerWidth * 0.075, height: '100%'}}> {/* 모델 리스트 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 0)", background: 'rgba(255, 255, 255, 0.5)', opacity : 1}}
            onClick = {() => {Page(0); set_all_reset(true); if(all_reset) {glasses_mode = 0; necklace_mode = 0; earring_mode = 0; set_all_reset(false);} else {glasses_mode = 0; necklace_mode = 0; earring_mode = 0; set_all_reset(true);}}}> ALL Reset </button> {/* 전체 리셋 */}

          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(1); set_G_reset(true); if(G_reset) {glasses_mode = 0; set_G_reset(false);} else {glasses_mode = 0; set_G_reset(true);}}}> Glasses Reset </button> {/* 안경만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(2); setVisible(true); if(visible) {glasses_mode = 1; setVisible(false);} else {glasses_mode = 1; setVisible(true);}}}> <img src = 'glasses1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(3); setVisible1(true); if(visible1) {glasses_mode = 2; setVisible1(false);} else {glasses_mode = 2; setVisible1(true);}}}> <img src = 'glasses2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(4); setVisible2(true); if(visible2) {glasses_mode = 3; setVisible2(false);} else {glasses_mode = 3; setVisible2(true);}}}> <img src = 'glasses3.png' height = {'100%'} wheight = {'100%'} /> </button>

          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(5); set_N_reset(true); if(N_reset) {necklace_mode = 0; set_N_reset(false);} else {necklace_mode = 0; set_N_reset(true);}}}> Necklace Reset </button> {/* 목걸이만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(6); setVisible3(true); if(visible3) {necklace_mode = 1; setVisible3(false);} else {necklace_mode = 1; setVisible3(true);}}}> <img src = 'necklace1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(7); setVisible4(true); if(visible4) {necklace_mode = 2; setVisible4(false);} else {necklace_mode = 2; setVisible4(true);}}}> <img src = 'necklace2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(8); setVisible5(true); if(visible5) {necklace_mode= 3; setVisible5(false);} else {necklace_mode = 3; setVisible5(true);}}}> <img src = 'necklace3.png' height = {'100%'} wheight = {'100%'} /> </button>

          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(9); set_E_reset(true); if(E_reset) {earring_mode = 0; set_N_reset(false);} else {earring_mode = 0; set_E_reset(true);}}}> Earring Reset </button> {/* 귀걸이만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(10); setVisible6(true); if(visible6) {earring_mode = 1; setVisible6(false);} else {earring_mode = 1; setVisible6(true);}}}> <img src = 'earring1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(11); setVisible7(true); if(visible7) {earring_mode = 2; setVisible7(false);} else {earring_mode = 2; setVisible7(true);}}}> <img src = 'earring2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(12); setVisible8(true); if(visible8) {earring_mode = 3; setVisible8(false);} else {earring_mode = 3; setVisible8(true);}}}> <img src = 'earring3.png' height = {'100%'} wheight = {'100%'} /> </button>            
        </div>
        
        <div className = "snap_0"> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{height: window.innerWidth * 0.075, width: window.innerWidth * 0.075}} onClick={() => {snapshot(); ClickSnap();}}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>

      </div>

      <button className = "go_button" style={{position: 'fixed', zIndex: 2, top : '90vh', left : '91.5vw' , height: 'auto', width: window.innerWidth * 0.075}} onClick = {GuidePageClick}> 다음 페이지로 이동 </button>
    </div>
    )}

  else { // 1: 출력화면이 세로가 길 경우
    return (
    <div id='camera_main_0'>  
      <div className = "Title_img"> 
        <div style={{padding: "1% 5% 1% 5%", fontSize : '20px'}}/>
      </div>
      
      <div id = 'loading' style={{position: 'absolute', zIndex: 5, ...sizing}} width = {sizing.width} height = {sizing.height}> 
            <div className="loading-css"></div>
            <div id="loading-text">loading</div>
      </div>
      <div id = 'snaped' style={{position: 'absolute', zIndex: 4, ...sizing}} width = {sizing.width} height = {sizing.height}> </div>
      <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
          gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
            <DirtyHook sizing={sizing} />
            <FaceFollower faceIndex={0} expression={_expressions[0]} />
      </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" src = 'ready.png' style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}
      
      <div className = "camera_mamu" style={{top : sizing.height}}>  {/* 메뉴 */}

        <div style={{zIndex: 2, height: "4vh", width: "100%", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list" style={{width: "auto", height: "auto", overflow : "auto"}}> {/* 모델 리스트 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 0)", background: 'rgba(255, 255, 255, 0.5)', opacity : 1}}
            onClick = {() => {Page(0); set_all_reset(true); if(all_reset) {glasses_mode = 0; necklace_mode = 0; earring_mode = 0; set_all_reset(false);} else {glasses_mode = 0; necklace_mode = 0; earring_mode = 0; set_all_reset(true);}}}> ALL Reset </button> {/* 전체 리셋 */}

          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(1); set_G_reset(true); if(G_reset) {glasses_mode = 0; set_G_reset(false);} else {glasses_mode = 0; set_G_reset(true);}}}> Glasses Reset </button> {/* 안경만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(2); setVisible(true); if(visible) {glasses_mode = 1; setVisible(false);} else {glasses_mode = 1; setVisible(true);}}}> <img src = 'glasses1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(3); setVisible1(true); if(visible1) {glasses_mode = 2; setVisible1(false);} else {glasses_mode = 2; setVisible1(true);}}}> <img src = 'glasses2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(255, 0, 0)", background: 'rgba(200, 20, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(4); setVisible2(true); if(visible2) {glasses_mode = 3; setVisible2(false);} else {glasses_mode = 3; setVisible2(true);}}}> <img src = 'glasses3.png' height = {'100%'} wheight = {'100%'} /> </button>

          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(5); set_N_reset(true); if(N_reset) {necklace_mode = 0; set_N_reset(false);} else {necklace_mode = 0; set_N_reset(true);}}}> Necklace Reset </button> {/* 목걸이만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(6); setVisible3(true); if(visible3) {necklace_mode = 1; setVisible3(false);} else {necklace_mode = 1; setVisible3(true);}}}> <img src = 'necklace1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(7); setVisible4(true); if(visible4) {necklace_mode = 2; setVisible4(false);} else {necklace_mode = 2; setVisible4(true);}}}> <img src = 'necklace2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 255, 0)", background: 'rgba(20, 200, 20, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(8); setVisible5(true); if(visible5) {necklace_mode= 3; setVisible5(false);} else {necklace_mode = 3; setVisible5(true);}}}> <img src = 'necklace3.png' height = {'100%'} wheight = {'100%'} /> </button>

          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(9); set_E_reset(true); if(E_reset) {earring_mode = 0; set_E_reset(false);} else {earring_mode = 0; set_E_reset(true);}}}> Earring Reset </button> {/* 귀걸이만 리셋 */}
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(10); setVisible6(true); if(visible6) {earring_mode = 1; setVisible6(false);} else {earring_mode = 1; setVisible6(true);}}}> <img src = 'earring1.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(11); setVisible7(true); if(visible7) {earring_mode = 2; setVisible7(false);} else {earring_mode = 2; setVisible7(true);}}}> <img src = 'earring2.png' height = {'100%'} wheight = {'100%'} /> </button>
          <button className = "visible_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1, border: "3px solid rgb(0, 0, 255)", background: 'rgba(20, 20, 200, 0.5)', opacity : 0.35}}
            onClick = {() => {Page(12); setVisible8(true); if(visible8) {earring_mode = 3; setVisible8(false);} else {earring_mode = 3; setVisible8(true);}}}> <img src = 'earring3.png' height = {'100%'} wheight = {'100%'} /> </button> 
        </div>
        
        <div className = "snap"> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}} onClick={() => {snapshot(); ClickSnap();}}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>
      </div>

      <button className = "go_button" style={{position: 'fixed', zIndex: 2, top : '73.5vh', left : '78.5vw' , height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}} onClick = {GuidePageClick}> 다음 페이지로 이동 </button>
    </div>
  )}  
};

export {App as default};