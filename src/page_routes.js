// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";

import Hat_AR from "./Hat_AR";
import Earring_AR from "./Earring_AR";
import Necklace_AR from "./Necklace_AR";
import MainHome from "./MainHome";
import GuidePage from "./GuidePage";
import Thankyou from "./Thankyou";

// 이번 프로젝트의 router 이동하기 위한 페이지 이다.
// 예외처리를 NotFound.js  로 표현하였다.

function Buttons() {
    return (
        <Router>
            <Routes>

                <Route path = "/" element = {<MainHome/>}/>
                <Route path = "/Hat_AR" element = {<Hat_AR/>}/>
                <Route path = "/Necklace_AR" element = {<Necklace_AR/>}/>
                <Route path = "/Earring_AR" element = {<Earring_AR/>}/>
                <Route path="/GuidePage" element = {<GuidePage/>}/>
                <Route path="/Thankyou" element = {<Thankyou/>}/>
                <Route path="*" element={<Notfound/>} /> 
            </Routes>
        </Router>
    );
};

export default Buttons;