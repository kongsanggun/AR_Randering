import React, { useState, useRef, useEffect } from "react";
import KakaoShareButton from "./KakaoShare";

import { faArrowLeft, faArrowRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScript } from "./hooks";

import axios from "axios";
import { ready } from "@tensorflow/tfjs";
import { FileSaver } from 'file-saver';

// 세로와 가로 길이 조절하여 return 하는 값들이다.
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

  return { width, height, top, left, mode }
}
 // 변수 받고
const sizing = compute_sizing()
// router 를 통한 페이지 어디로 이동할지 결정하는 함수이다.
function NecklaceClick(e) {
  window.location.href = "Necklace_AR"
}

// 페이지 가이드 메인
const GuidePage = () => {

  let [changeImages, setChangeImages] = useState(null);
  console.log(changeImages);

  let url = "/download"
  // 여기는 설명이 좀 필요한데
  //sessionstorage로 구현을 안하였다.
  // 즉 image 에서 파일 맨 마지막 위치를 찾아서 이름을 return 받고
  // 하는 방식인데 여기는 그렇게 하다가 더 편한 방식을 찾아서
  // 하다가 남은 잔재이다. 하지만 잘 쓰면 돌아갈지도?
  const handleDownload = () => {
    axios.get(url, {
      // 주소와 formdata를 posting 한다
    })
      .then(res => {
        //상태 출력
        console.warn(res);
        //GuidePageClick();
      }).catch(err => {
        console.log(err);
      });
  }

// Thankyou page를 router 통해서 이동할 수 있게 하는 함수
function ThankyouClick(e) {
  window.location.href = "Thankyou"
}
 // kakao로그인 및 공유 링크 구현할려다가 잘 안된 잔재다.
const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");

// 위와 마찬가지로 하다가 잘 안된 카카오의 잔재다. 망할 카카오
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
    container: '#create-kakao-link-btn',
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
// 여기까지 카카오 사용할려고 예시로 하였는데 잘 되는걸 확인
// link 부분에서는 따로 도메인을 가져와야 하는 상황이 발생하기에 포기하였다.

if (sizing.mode === 0) {// 0 : 출력화면이 가로가 길 경우
  return (
    <div className="preview_0">
      <div className="Title_img_0" style={{ position: 'absolute', left: sizing.left * (window.innerWidth / sizing.wWidth), width: sizing.width }} >
        <button className="back_button" onClick={NecklaceClick}> <FontAwesomeIcon icon={faArrowLeft} color="white" size="3x" /> </button> {/* 돌아가기 */}
        <div style={{padding: "2% 0% 2% 0%", fontSize: 'calc(20px + 1vmin)'}} > 사진 미리보기 </div>
        <button className="next_button" onClick={ThankyouClick}> <FontAwesomeIcon icon={faArrowRight} color="white" size="3x" /> </button> {/* 감사 */}
      </div>

      <img src={"http://localhost:5000/bring_data"} style={{ position: 'absolute', left: sizing.left * (window.innerWidth / sizing.wWidth) }} width={sizing.width} height={sizing.height} />

      <div className="Link_list" style={{ width: sizing.width, left: sizing.left, zindex: 2 }}>
        {/* 지금 구현 중인 곳이다 */}
        <div className="Link">
          <a href={"http://localhost:5000/download"} download> <button className = "download" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05} type="button">
          <FontAwesomeIcon icon={faDownload} color="white" size="2x" />
          </button></a>
          Download
        </div>

        <div className="Link">
          <img className="icons" src="btnG_icon_square.png" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05}
            onClick={() => {
              window.open('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com', '_blank')
            }
            } />
          Naver
        </div>
        <div id="create-kakao-link-btn" className="Link">
          <img className="icons" src="kakaolink_btn_medium.png" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05}
            onClick={() => {
              window.open('https://accounts.kakao.com/login?continue=https%3A%2F%2Faccounts.kakao.com%2Fweblogin%2Faccount', '_blank')
            }
            }
          />
          Kakao
        </div>

      </div>

    </div>
  )
}
else { // 1 : 출력화면이 세로가 길 경우
  return (

    <div className="preview">

      <div className="Title_img">
        <button className="back_button" onClick={NecklaceClick}> <FontAwesomeIcon icon={faArrowLeft} color="white" size="3x" /> </button> {/* 돌아가기 */}
        <div style={{padding: "2% 0% 2% 0%", fontSize: 'calc(20px + 1vmin)'}} > 사진 미리보기 </div>
        <button className="next_button" onClick={ThankyouClick}> <FontAwesomeIcon icon={faArrowRight} color="white" size="3x" /> </button> {/* 감사 */}
      </div>

      <img src={"http://localhost:5000/bring_data"} style={{left: sizing.left * (window.innerWidth / sizing.wWidth) }} width={sizing.width} height={sizing.height} />

      <div className="Link_list" style={{ width: "100vw" }}>
        {/* 지금 구현 중인 곳이다 */}

        <div className="Link">

          <a href={"http://localhost:5000/download"} download><button className = "download" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05} type="button">
          <FontAwesomeIcon icon={faDownload} color="white" size="2x" />
          </button></a>
          Download
        </div>

        <div className="Link">
          <img className="icons" src="btnG_icon_square.png" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05}
            onClick={() => {
              window.open('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com', '_blank')
            }} />
          Naver
        </div>
        <div className="Link">

          <img id="create-kakao-link-btn" className="icons" src="kakaolink_btn_medium.png" height={window.innerHeight * 0.05} width={window.innerHeight * 0.05}
            onClick={() => {
              window.open('https://accounts.kakao.com/login?continue=https%3A%2F%2Faccounts.kakao.com%2Fweblogin%2Faccount', '_blank')
            }
            } />
          Kakao
        </div>

      </div>

    </div>
  )
}
};

export default GuidePage;