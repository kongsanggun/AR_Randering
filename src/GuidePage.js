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
            <div className="preview_0" style={{position: 'fixed', width : "100%", height : "100%"}}>

                <div className = "Title_img" style={{position: 'fixed', zIndex: 1, top : 0, left : sizing.left, width : sizing.width}} > 
                    <div style={{padding: "2% 1% 2% 5%", fontSize : '30px'}} > 사진 미리보기0 </div>
                    <button className = "back_button" style={{zIndex: 2, width : "auto", height : "auto", padding: "1% 5% 1% 5%"}} onClick = {NecklaceClick}> 
                    <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
                </div>
                
                <img src="08c3d43117adf478.jpg" style={{position: 'fixed', left : sizing.left}} width = {sizing.width} height = {sizing.height}/>
                
                <div className = "Link_list_0" style={{zIndex: 2, height: "auto", width: sizing.width, left : sizing.left, backgroundColor : "rgba(0,0,0,0.5)"}}>
                <button onClick = {handleKakaoButton}>카카오로 공유</button>
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
                    Naver
                </div>
                <div className = "Link" style={{zIndex: 2, width : "auto", height: "auto"}}>
                    <img src = "kakaolink_btn_medium.png"style = {{height: window.innerHeight * 0.05, width: window.innerHeight * 0.05, maxHeight : '75px', maxWidth : '75px', minHeight : '45px', minWidth : '45px', paddingBottom : '1.5%' }} />
                    
                    
                </div>
               
              
            </div> 
            
        </div>
      )
    }
};

export default GuidePage;