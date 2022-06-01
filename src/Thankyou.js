import React,{useState,useEffect} from "react";
import "./App.css";
import { useScript } from "./hooks";
const Thankyou = () => {
// 마지막에 감사하다는 말 + 메인 페이지로 return 할려는 js다 읽어주셔서 감사합니다.

    function MainClick(e){
        window.location.href = "/"
    }

    return (
      <div className="App">
      <header className="App-header">
        <div className = "header">
          <p className="header-text"> 감사합니다!</p>
          <p className="header-text2" >다음에도 이용해주시길 바랍니다.</p>
          <p className="header-text2" >만약 다른 오류가 발생하면 github에 문의 남겨주세요!.</p>
          <p className="header-text2" >다시 이용하실려면 돌아가기 버튼을 눌러주세요.</p>
          <button className = "start" onClick={MainClick} > 메인으로 돌아가기 </button>
        </div>

        <div className="main" style = {{opacity: '0'}}>
            
        </div>
      
        <div className = "footer">
          <div>
            <p className = "footer_text"> ACC Studio by JSC Team (2022) <a href="https://github.com/kongsanggun/AR_Randering"> github </a> </p>
          </div>
        </div>       
      </header>

      </div>
    );
  };

  export default Thankyou;