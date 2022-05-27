import React,{useState,useEffect} from "react";
import "./App.css";
import { useScript } from "./hooks";
const Thankyou = () => {

    function MainClick(e){
        window.location.href = "/"
    }

    return (
      <div className="App">
      <header className="App-header">
        <h1>감사합니다!</h1>
        
        <p>다음에도 이용해주시길 바랍니다!</p>

        <p>다시 이용하실려면 돌아가기 버튼을 눌러주세요!</p>
        <button className = "buttontransfer"
            onClick={MainClick} > 메인으로 돌아가기 </button>
                
        </header>
      </div>
    );
  };

  export default Thankyou;