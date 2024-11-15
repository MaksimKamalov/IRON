import {configureStore} from "@reduxjs/toolkit";
import appStateSlice from "./slices/appStateSlice";


export const store = configureStore({
    reducer: {
        appStateSlice: appStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>