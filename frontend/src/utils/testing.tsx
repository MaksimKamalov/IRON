import {configureStore} from "@reduxjs/toolkit";
import appStateSlice, {Page, UserRole} from "../store/slices/appStateSlice";
import {Provider} from "react-redux";
import React from "react";
import {render} from "@testing-library/react";

export function renderWithProviders(
    ui,
    store = configureStore({
        reducer: {
            appStateSlice: appStateSlice
        }
    })
) {


    function Wrapper({children}) {
        return <Provider store={store}>{children}</Provider>;
    }

    return {store, ...render(ui, {wrapper: Wrapper})};
}