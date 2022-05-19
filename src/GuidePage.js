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

    if (sizing.mode === 0) {// 0 : 출력화면이 가로가 길 경우
        return (
            <div className="preview_0" style={{position: 'fixed', width : "100%", height : "100%"}}>

                <div className = "Title_img" style={{position: 'fixed', zIndex: 1, top : 0, left : sizing.left, width : sizing.width}} > 
                    <div style={{padding: "2% 1% 2% 5%", fontSize : '30px'}} > 사진 미리보기0 </div>
                    <button className = "back_button" style={{zIndex: 2, width : "auto", height : "auto", padding: "1% 5% 1% 5%"}} onClick = {NecklaceClick}> 
                    <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
                </div>

                <img src="08c3d43117adf478.jpg" style={{position: 'fixed', left : sizing.left}} width = {sizing.width} height = {sizing.height}/>
                
                <div className = "Link_list_0" style={{zIndex: 2, height: "auto", width: sizing.width, left : sizing.left, backgroundColor : "rgba(0,0,0,0.5)"}}>
                    <div className = "Link" style={{zIndex: 2, width : "auto", height: "auto"}}>
                        <img src = "btnG_icon_square.png" 
                        style={{height: window.innerHeight * 0.05, width: window.innerHeight * 0.05, maxHeight : '75px', maxWidth : '75px', minHeight : '45px', minWidth : '45px', paddingBottom : '1.5%'}}
                        onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                        Zepeto
                    </div>
                    <div className = "Link" style={{zIndex: 2, width : "auto", height: "auto"}}>
                        <img src = "kakaolink_btn_medium.png"style = {{height: window.innerHeight * 0.05, width: window.innerHeight * 0.05, maxHeight : '75px', maxWidth : '75px', minHeight : '45px', minWidth : '45px', paddingBottom : '1.5%' }} />
                        SnapChat
                    </div>
                </div>

            </div>
        )
    }
    else { // 1 : 출력화면이 세로가 길 경우
      return (
        <div className="preview" style={{position: 'fixed', zIndex: 2, top : 0, width : "100wh", height : "100vh"}}>
            <div className = "Title_img" style={{zIndex: 2, width : "100%", height : "8%"}} > 
                    <div style={{padding: "1% 5% 1% 5%", fontSize : '20px'}} > 사진 미리보기1 </div>
                    <button className = "back_button" style={{width : "auto", height : "auto", padding: "1% 5% 1% 5%"}} onClick = {NecklaceClick}> 
                    <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
            </div>

            <img src="08c3d43117adf478.jpg" width = {sizing.width} height = {sizing.height}/>

            <div className = "Link_list" style={{zIndex: 2, height: "auto", width: "100%"}}>
                <div className = "Link" style={{zIndex: 2, width : "auto", height: "auto"}}>
                    <img src = "btnG_icon_square.png" 
                    style={{height: window.innerHeight * 0.05, width: window.innerHeight * 0.05, maxHeight : '75px', maxWidth : '75px', minHeight : '45px', minWidth : '45px', paddingBottom : '1.5%'}}
                    onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                    Zepeto
                </div>
                <div className = "Link" style={{zIndex: 2, width : "auto", height: "auto"}}>
                    <img src = "kakaolink_btn_medium.png"style = {{height: window.innerHeight * 0.05, width: window.innerHeight * 0.05, maxHeight : '75px', maxWidth : '75px', minHeight : '45px', minWidth : '45px', paddingBottom : '1.5%' }} />
                    SnapChat
                </div>
            </div> 
        </div>
      )
    }
};

export default GuidePage;