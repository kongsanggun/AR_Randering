import React,{useState,useEffect} from "react";
import "./App.css";
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


    return (
      <div className="App">
      <header className="App-header">
        <h1>안녕하세요!</h1>
        
        <p>ACC Studio 에 오신걸 환영합니다!</p>

        <button className = "buttontransfer"
            onClick={EarringClick} > 귀걸이 AR 렌더링 페이지 </button>
        
        <button className = "buttontransfer"
            onClick={HatClick} > 모자 AR 렌더링 페이지 </button>

        <button className = "buttontransfer"
            onClick={NecklaceClick} > 작업중인 페이지! </button>
        

        
        </header>
      </div>
    );
  };

  export default Home;