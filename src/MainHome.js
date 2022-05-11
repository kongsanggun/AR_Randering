import React,{useState,useEffect} from "react";
import "./App.css";


const Home = () => {

    function EarringClick(e){
        window.location.href = "/Earring_AR"
    }
    function HatClick(e){
        window.location.href = "/Hat_AR"
    }
    
    return (
      <div className="App">
      <header className="App-header">
        <h1>안녕하세요!</h1>
        
        <p>ACC Studio 에 오신걸 환영합니다!</p>

        <button className = "buttontranser"
            onClick={EarringClick} > 귀걸이 AR 렌더링 페이지 </button>

        
        <button className = "buttontranser"
            onClick={EarringClick} > 귀걸이 AR 렌더링 페이지 </button>


        </header>
      </div>
    );
  };

  export default Home;