import React, { useState, useRef, useEffect } from "react";
import KakaoShareButton from "./KakaoShare";

import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScript } from "./hooks";

import axios from "axios";
import { ready } from "@tensorflow/tfjs";
import { FileSaver } from 'file-saver';

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
const sizing = compute_sizing()
function NecklaceClick(e) {
  window.location.href = "Necklace_AR"
}


const GuidePage = () => {

  let [changeImages, setChangeImages] = useState(null);
  let [confusionMatrix,setConfusionMatrix] = useState('');
  const [previewfile, setPreviewFile] = useState("");
  const [previewfile2, setPreviewFile2] = useState("");
  console.log(changeImages);

  let url = "/download"
  useEffect(() => {
    bringImagefrom();
  }, [confusionMatrix,previewfile]);

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


function ThankyouClick(e) {
  window.location.href = "Thankyou"
}

const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");

// kakao sdk 초기화하기
// status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.


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

const bringImagefrom = () => {
  
  axios.get('bring_data',{

  }).then(response =>{

  let matrixData = response; //The response from flask's send_file
  console.log(response); 
  let matrixBlob = new Blob([matrixData.data], {type:"image/png"}); 
  console.log(matrixBlob);
  let fileReader = new FileReader();
  fileReader.readAsDataURL(matrixBlob);
  fileReader.onload = () => { 
      let result = fileReader.result; 
      console.log(result); 
      setConfusionMatrix(result);
      setPreviewFile(dataURLtoFile(result,"temp.png"));
      console.log(previewfile);
      setPreviewFile2(URL.createObjectURL(previewfile));
  }
}).catch(err => {
  console.log(err);
})
  
};


if (sizing.mode === 0) {// 0 : 출력화면이 가로가 길 경우
  return (
    <div className="preview_0">
      <div className="Title_img_0" style={{ position: 'absolute', left: sizing.left * (window.innerWidth / sizing.wWidth), width: sizing.width }} >
        <div style={{ padding: "2% 1% 2% 5%", fontSize: '30px'}} > 사진 미리보기 </div>
        <button className="back_button" onClick={NecklaceClick}> <FontAwesomeIcon icon={faArrowLeft} color="white" size="3x" /> </button>
        <button className="next_button" onClick={ThankyouClick}></button>
      </div>

      <img src={previewfile2} style={{ position: 'absolute', left: sizing.left * (window.innerWidth / sizing.wWidth) }} width={sizing.width} height={sizing.height} />

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
              window.open('https://www.naver.com/', '_blank')
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
        <div style={{ padding: "1% 5% 1% 5%", fontSize: '20px' }} > 사진 미리보기 </div>
        <button className="back_button" onClick={NecklaceClick}>
          <FontAwesomeIcon icon={faArrowLeft} color="white" size="3x" /> </button>
        <button className="next_button" onClick={ThankyouClick}> </button>
      </div>

      <img src={"http://localhost:5000/bring_data2"} style={{left: sizing.left * (window.innerWidth / sizing.wWidth) }} width={sizing.width} height={sizing.height} />

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
              window.open('https://www.naver.com/', '_blank')
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