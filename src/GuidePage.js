import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "./App.css";
import axios from 'axios';
import { time } from "@tensorflow/tfjs";
import { Navigate, useNavigate } from "react-router";
import Kakao from './Kakao.js';



const GuidePage = () => {
    const [image, setShowImage] = useState('');


    function NecklaceClick(e){
        window.location.href = "Necklace_AR"
    }

    return (
        <div className="App-header">
            <h1 > 사진 미리보기 </h1>
            <img src="08c3d43117adf478.jpg" ></img>
            <h1>Zepeto</h1>

            <button className="buttonshow" onClick={() =>
                window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}>
                Naver로 안내</button>

            <h1>SnapChat</h1>

                <button className="buttonshow" >
                kakaotalk으로 안내</button>

            <button className = "buttonshow" onClick = {NecklaceClick}>

             뒤로가기 </button>

        </div>
    );
};

export default GuidePage;