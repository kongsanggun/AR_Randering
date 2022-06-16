import React, { useState, useEffect } from "react";
import "./App.css";
// 슬라이드 css 
import "./Slideshow.css"

const Home = () => {
  // router 를 통하여 어디로 이동 할지 결정되는 3개 함수들 2개는 사용x
  function EarringClick(e) {
    window.location.href = "/Earring_AR"
  }
  function HatClick(e) {
    window.location.href = "/Hat_AR"
  }
  function NecklaceClick(e) {
    window.location.href = "/Necklace_AR"
  }
  // 애니메이션 슬라이드 사용
  let slideIndex = 1;
  let Timeout;
  //  timeout 을 주어서 일정 시간마다 넘길 수 있게 구현하였다.
  // 왼쪽 오른쪽 버튼 붙여서 임의로 넘길수 있게 구현하였다.
  function plusSlides(n) {
    clearTimeout(Timeout); showSlides(slideIndex += n);
  }
  function showSlides(n) {
    clearTimeout(Timeout);
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
    slides[slideIndex - 1].style.display = "block";
    Timeout = setTimeout(() => { showSlides(++slideIndex) }, 5000);
  }

  useEffect(() => { showSlides(slideIndex); })


  // 보여주는 페이지
  return (
    <div className="App">
      <header className="App-header">

        <div className="header" style={{}}>
          <p className="header-text"> ACC Studio에 오신걸 환영합니다! </p>
          <div>
            <p className="header-text2"> ACC에서는 당신이 쓰는 악세서리를 자유롭게 쓰고 사진 촬영 할 수 있습니다. </p>
            <p className="header-text2"> 여러분이 공유하고 싶은 사진을 마음껏 찍어주세요!  </p>
          </div>
          <button className="start" onClick={NecklaceClick} > 시작하기 </button>
        </div>

        <div className="main">
          <div className="main_text1"> ACC Studio 사용 방법 </div>

          <div className="slideshow">
            <div className="mySlides fade">
              <div className="numbertext">1 / 4</div>
              <img className = "Main_img" src = "S_1.jpg"/>
              <div className="fadeimg" />
              <div className="text"> 1. 카메라가 정상적으로 인식 되는지 확인해 주세요! </div>
            </div>

            <div className="mySlides fade" style={{ display: 'none' }}>
              <div className="numbertext">2 / 4</div>
              <img className = "Main_img" src = "11.png"/>
              <div className="fadeimg" />
              <div className="text"> 2. 그 다음 카메라에 얼굴을 비추고 원하는 악세서리를 선택해 주세요! </div>
            </div>

            <div className="mySlides fade" style={{ display: 'none' }}>
              <div className="numbertext">3 / 4</div>
              <img className = "Main_img" src = "22.png"/>
              <div className="fadeimg" />
              <div className="text"> 3. 잠시 후 선택된 악세서리가 얼굴에 나타나게 됩니다! </div>
            </div>

            <div className="mySlides fade" style={{ display: 'none' }}>
              <div className="numbertext">4 / 4</div>
              <img className = "Main_img" src = "33.png"/>
              <div className="fadeimg" />
              <div className="text"> 4. 사진 미리보기와 함께 저장할 수 있는 기능과 Kakao, Naver로 이동할 수 있는 페이지가 나오게 됩니다! </div>
            </div>

            <a className="prev" onClick={() => { plusSlides(-1); }}>❮</a>
            <a className="next" onClick={() => { plusSlides(1); }}>❯</a>
          </div>
        </div>

        <div className="footer">
          <div>
            <p className="footer_text"> ACC Studio by JSC Team (2022) <a href="https://github.com/kongsanggun/AR_Randering"> github </a> </p>
          </div>
        </div>

      </header>
    </div>
  );
};

export default Home;