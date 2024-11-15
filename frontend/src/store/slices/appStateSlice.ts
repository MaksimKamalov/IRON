import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ProfileData} from "../../types";

export enum Page {
    AUTH,GAME
}

export enum UserRole {
    PLAYER="Player",
    CREATOR="Creator"
}

interface State {
    profile: ProfileData,
    page: Page,
    role: UserRole,
    gameId: string
}

const initialState: State = {
    profile: null,
    page: Page.AUTH,
    role: UserRole.CREATOR,
    gameId: null
};

const appStateSlice = createSlice({
    name: "appStateSlice",
    initialState,
    reducers: {
        setProfileData: (state: State,action:PayloadAction<ProfileData>) => {
            state.profile = {...state.profile,...action.payload};
        },
        resetProfileData: (state: State,action) => {
            state.profile = null;
        },
        setUserRole: (state: State,action:PayloadAction<UserRole>) => {
            state.role = action.payload;
        },
        setPage: (state: State,action:PayloadAction<Page>) => {
            state.page = action.payload;
        },
        setGameId: (state: State,action:PayloadAction<string>) => {
            state.gameId = action.payload;
        }
    }
});

const {actions,reducer} = appStateSlice;

export const setProfileData = actions.setProfileData;
export const resetProfileData = actions.resetProfileData;
export const setUserRole = actions.setUserRole;
export const setPage = actions.setPage;
export const setGameId = actions.setGameId;

export default reducer;