import Auth from "./features/auth/screens/Auth";
import React, {useEffect} from "react";
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
import AppRoute from "./routes/AppRoute";
import "./assets/styles/index.css";
import {Provider} from "react-redux";
import {store} from "./store/store";
import { text } from "stream/consumers";
import { colors } from "@mui/material";
import AlertTemplate from "./components/alertTemplate/AlertTemplate";

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 1500,
    offset: '30px',
    type: "error",
    transition: transitions.SCALE,
    containerStyle: {
        zIndex: 1400,
        color: "var(--main-pink)"
    }
};

function App() {

    return (
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...options}>
                <AppRoute/>
            </AlertProvider>
        </Provider>
    );
}

export default App;
