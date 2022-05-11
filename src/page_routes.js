// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";

import Hat_AR from "./Hat_AR";
import Earring_AR from "./Earring_AR";
import Necklace_AR from "./Necklace_AR";
import MainHome from "./MainHome";

function Buttons() {
    return (
        <Router>
            <Routes>

                <Route path = "/" element = {<MainHome/>}/>
                <Route path = "/Hat_AR" element = {<Hat_AR/>}/>
                <Route path = "/Necklace_AR" element = {<Necklace_AR/>}/>
                <Route path = "/Earring_AR" element = {<Earring_AR/>}/>
            
            </Routes>
        </Router>
    );
};

export default Buttons;