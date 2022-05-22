import React, { useState, useRef, useEffect } from "react";
import KakaoShareButton from "./KakaoShare";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScript } from "./hooks";
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
    

    function NecklaceClick(e){
        window.location.href = "Necklace_AR"
    }

    const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
	
	// kakao sdk 초기화하기
	// status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
	useEffect(() => {
		if (status === "ready" && window.Kakao) {
			// 중복 initialization 방지
			if (!window.Kakao.isInitialized()) {
				// 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
				window.Kakao.init('c452cde88c858e578906042615650624');
			}
		}
	}, [status]);	

    const currentUrl = window.location.href;
    const handleKakaoButton = () => {
        window.Kakao.Link.sendScrap({
            requestUrl: currentUrl,
        });
    };
    

    if (sizing.mode === 0) {// 0 : 출력화면이 가로가 길 경우
        return (
            <div className="preview_0">
                <div className = "Title_img_0" style={{left : sizing.left, width : sizing.width}} > 
                    <div style={{padding: "2% 1% 2% 5%", fontSize : '30px'}} > 사진 미리보기0 </div>
                    <button className = "back_button" onClick = {NecklaceClick}> <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
                </div>
                
                <img src="08c3d43117adf478.jpg" style={{position: 'fixed', left : sizing.left}} width = {sizing.width} height = {sizing.height}/>
                
                <div className = "Link_list" style={{width: sizing.width, left : sizing.left, backgroundColor : "rgba(0,0,0,0.5)"}}>
                    <div className = "Link">
                        <img className="icons" src = "btnG_icon_square.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05}
                        onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                        Naver
                    </div>
                    <div className = "Link">
                        <img className="icons" src = "kakaolink_btn_medium.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05} 
                        onClick = {handleKakaoButton}/>
                        Kakao
                    </div>
                    
                </div>

            </div>
        )
    }
    else { // 1 : 출력화면이 세로가 길 경우
      return (
        <div className="preview">
            <div className = "Title_img"> 
                <div style={{padding: "1% 5% 1% 5%", fontSize : '20px'}} > 사진 미리보기1 </div>
                <button className = "back_button" onClick = {NecklaceClick}> <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
            </div>

            <img src="08c3d43117adf478.jpg" width = {sizing.width} height = {sizing.height}/>

            <div className = "Link_list" style={{width: "100vw"}}>
                <div className = "Link">
                    <img className="icons" src = "btnG_icon_square.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05}
                    onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                    Naver
                </div>
                <div className = "Link">
                    <img className="icons" src = "kakaolink_btn_medium.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05} 
                    onClick = {handleKakaoButton}/>
                    Kakao
                </div>

            </div> 
            
        </div>
      )
    }
};

export default GuidePage;