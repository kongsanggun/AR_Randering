import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "./App.css";
import axios from 'axios';
import { time } from "@tensorflow/tfjs";
import { Navigate, useNavigate } from "react-router";
import Kakao from './Kakao.js';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const compute_sizing = () => {
    // compute  size of the canvas:
    const wheight = (window.innerHeight)
    const wWidth = (window.innerWidth)
  
    const height = Math.min(wWidth, wheight) 
    const width = Math.min(wWidth, wheight)
    const mode = (height === wheight) ? 0 : 1 // 0 : 웹 , 1 : 폰
  
    // compute position of the canvas:
    const top = 0
    const left = (wWidth - width) / 2
    
    return {width, height, top, left, mode}
}
const sizing = compute_sizing()

const GuidePage = () => {
    const [image, setShowImage] = useState('');

    function NecklaceClick(e){
        window.location.href = "Necklace_AR"
    }

    if (sizing.mode === 0) // 0 : 출력화면이 세로가 길 경우
    { 
        return (
            <div className="App-header">
                <div className = "Title_img" style={{position: 'fixed', zIndex: 2, top : 0, left : sizing.left, width : sizing.width}} > 
                    <h1> 사진 미리보기 </h1>
                </div>
                <img src="08c3d43117adf478.jpg" 
                style={{position: 'fixed', zIndex: 1,...sizing}} 
                width = {sizing.width} height = {sizing.height} />
                
                <div className = "Link" style={{position: 'fixed', zIndex: 2, top : (window.innerHeight) - 225, left : (window.innerWidth) - 400}}>
                    <h1>Zepeto</h1>
                    <img src = "btnG_icon_circle.png" 
                    style={{height: '100px', width: '100px'}}
                    onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                </div>
                
                <div className = "Link" style={{position: 'fixed', zIndex: 2, top : (window.innerHeight) - 225, left : (window.innerWidth) - 200}}>
                    <h1>SnapChat</h1>
                    <img src = "kakaolink_btn_medium.png" 
                    style = {{height: '100px', width: '100px'}} />
                </div>
                <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, top : 0, left : (window.innerWidth) - 75}} onClick = {NecklaceClick}> 
                <FontAwesomeIcon icon = {faArrowLeft} size="5x"/> </button>
            </div>
      )
    }
    else { // 1 : 출력화면이 가로가 길 경우
      return (
        <div className="App-header">
            <div className = "Title_img" style={{position: 'fixed', zIndex: 2, top : sizing.height - 90, left : sizing.left, width : sizing.width }} > 
                <h1> 사진 미리보기 </h1>
            </div>
            <img src="08c3d43117adf478.jpg" 
            style={{position: 'fixed', zIndex: 1,...sizing}} 
            width = {sizing.width} height = {sizing.height} />
                
            <div className = "Link" style={{position: 'fixed', zIndex: 2, top : (window.innerHeight) - 225, left : (window.innerWidth) - 350}}>
                <h1>Zepeto</h1>
                <img src = "btnG_icon_circle.png" 
                style={{height: '100px', width: '100px'}}
                onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
            </div>
                
            <div className = "Link" style={{position: 'fixed', zIndex: 2, top : (window.innerHeight) - 225, left : (window.innerWidth) - 200}}>
                <h1>SnapChat</h1>
                <img src = "kakaolink_btn_medium.png" 
                style = {{height: '100px', width: '100px'}} />
            </div>
            
            <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, top : 0, left : (window.innerWidth) - 75}} onClick = {NecklaceClick}> 
                <FontAwesomeIcon icon = {faArrowLeft} size="5x"/> </button>
        </div>
      )
    }
};

export default GuidePage;