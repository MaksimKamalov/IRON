import React from 'react';
import { Outlet } from "react-router-dom";
import "./index.css";

const Layout = () => {
    return (
        <>
            <div className="layout">
                <Outlet />                
                <div className="cloud1"/>   
                <div className='cloud2'/>             
            </div>
        </>
    );
};

export default Layout;