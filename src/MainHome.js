import React,{useState,useEffect} from "react";
import "./App.css";
import "./Slideshow.css"
import { useScript } from "./hooks";
const Home = () => {

    function EarringClick(e){
        window.location.href = "/Earring_AR"
    }
    function HatClick(e){
        window.location.href = "/Hat_AR"
    }
    function NecklaceClick(e){
        window.location.href = "/Necklace_AR"
    }
    
    let slideIndex = 1;
    let Timeout;

    function plusSlides(n) {clearTimeout(Timeout); showSlides(slideIndex += n);}
    function showSlides(n) {
      clearTimeout(Timeout);
      let i;
      let slides = document.getElementsByClassName("mySlides");
      if (n > slides.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {slides[i].style.display = "none";}
      slides[slideIndex-1].style.display = "block"; 
      Timeout = setTimeout(() => {showSlides(++slideIndex)}, 5000); 
    }

    useEffect(() => {showSlides(slideIndex);})

    return (
      <div className="App">
        <header className="App-header">

          <div className = "header" style = {{display : 'block', backgroundColor : 'green', width : '100vw', height : 'auto'}}>
            <p className = "header-text"> ACC Studio에 오신걸 환영합니다! </p>
            <p className = "header-text2"> ACC에서는 당신이 쓰는 악세서리를 자유롭게 쓰고 사진 촬영 할 수 있습니다. </p>
            <p className = "header-text2"> 여러분이 공유하고 싶은 사진을 마음껏 찍어주세요!  </p>
          </div>

        <div className = "slideshow">
          <div className = "mySlides fade">
            <div className = "numbertext">1 / 5</div>
            <div className = "fadeimg"/>
            <div className = "text"> 1. 카메라가 정상적으로 인식 되는지 확인해 주세요! </div>
          </div>

          <div className = "mySlides fade" style = {{display : 'none'}}>
            <div className = "numbertext">2 / 5</div>
            <div className = "fadeimg"/>
            <div className = "text"> 2. 그 다음 카메라에 얼굴을 비추고 원하는 악세서리를 선택해 주세요! </div>
          </div>

          <div className = "mySlides fade" style = {{display : 'none'}}> 
            <div className = "numbertext">3 / 5</div>
            <div className = "fadeimg"/>
            <div className = "text"> 3. 잠시 후 선택된 악세서리가 얼굴에 나타나게 됩니다! </div>
          </div>

          <div className = "mySlides fade" style = {{display : 'none'}}> 
            <div className = "numbertext">4 / 5</div>
            <div className = "fadeimg"/>
            <div className = "text"> 4. 마음에 드는 사진이 나올 경우 사진을 찍고 다음 페이지로 넘어갈 때 까지 기다려 주세요! </div>
          </div>

          <div className = "mySlides fade" style = {{display : 'none'}}> 
            <div className = "numbertext">5 / 5</div>
            <div className = "fadeimg"/>
            <div className = "text"> 5. 사진 미리보기와 함께 저장할 수 있는 기능과 Kakao, Naver로 이동할 수 있는 페이지가 나오게 됩니다! </div>
          </div>

          <a className="prev" onClick = {() => {plusSlides(-1);}}>❮</a>
          <a className="next" onClick = {() => {plusSlides(1);}}>❯</a>
        </div>

        <button className = "start" onClick={NecklaceClick} > 시작하기! </button>

        </header>
      </div>
    );
  };

  export default Home;