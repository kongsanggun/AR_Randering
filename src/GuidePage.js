import React, { useState, useRef, useEffect } from "react";
import KakaoShareButton from "./KakaoShare";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScript } from "./hooks";
import Images from "./public/17a6ac053b34cc9b9.jpg";
import axios from "axios";
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
function NecklaceClick(e){
  window.location.href = "Necklace_AR"
}

const bring_image = () => {
  let url = "/api";
  axios.post(url, {
    // 주소와 formdata를 posting 한다
 })
 .then(res => { 
   //상태 출력

     console.warn(res);
     NecklaceClick();
 })
}
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

    const handleKakaoButton = () => {
        window.Kakao.Link.createDefaultButton({
            container : '#create-kakao-link-btn',
            objectType: 'feed',
    content: {
      title: '딸기 치즈 케익',
      description: '#케익 #딸기 #삼평동 #카페 #분위기 #소개팅',
      imageUrl:
        'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
      link: {
        mobileWebUrl: 'https://developers.kakao.com',
        webUrl: 'https://developers.kakao.com',
      },
    },
    
    social: {
      likeCount: 286,
      commentCount: 45,
      sharedCount: 845,
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
          webUrl: 'http://localhost:5000/api',
        },
      },
      {
        title: '앱으로 보기',
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
          webUrl: 'https://developers.kakao.com',
        },
      },
    ],
        });
    };
    

    if (sizing.mode === 0) {// 0 : 출력화면이 가로가 길 경우
        return (
            <div className="preview_0">
                <div className = "Title_img_0" style={{position: 'absolute', left : sizing.left * (window.innerWidth / sizing.wWidth), width : sizing.width}} > 
                    <div style={{padding: "2% 1% 2% 5%", fontSize : '30px'}} > 사진 미리보기0 </div>
                    <button className = "back_button" onClick = {NecklaceClick}> <FontAwesomeIcon icon = {faArrowLeft} color="white" size = "3x"/> </button>
                </div>
                
                <img src="08c3d43117adf478.jpg" style={{position: 'absolute', left : sizing.left * (window.innerWidth / sizing.wWidth)}} width = {sizing.width} height = {sizing.height}/>
                
                <div className = "Link_list" style={{width: sizing.width, left : sizing.left, backgroundColor : "rgba(0,0,0,0.5)", zindex : 2}}>
                    <div className = "Link">
                        <img className="icons" src = "btnG_icon_square.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05}
                        onClick={() => window.open('https://studio.zepeto.me/kr/console/auth/signin', '_blank')}/>
                        Naver
                    </div>
                    <div id = "create-kakao-link-btn" className = "Link">
                        <img className="icons" src = "kakaolink_btn_medium.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05} 
                        onClick = {bring_image}/>
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
                <div  className = "Link">
  
                    <img id = "create-kakao-link-btn" className="icons" src = "kakaolink_btn_medium.png" height = {window.innerHeight * 0.05} width = {window.innerHeight * 0.05} 
                    onClick = {handleKakaoButton}/>
                    Kakao
                </div>

            </div> 
            
        </div>
      )
    }
};

export default GuidePage;