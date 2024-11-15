import {ProfileData} from "../../../types";
import {UserRole} from "../../../store/slices/appStateSlice";

export enum MessageType {
    LOAD_DATA,
    CLOSE,
    PAINT,
    MESSAGE,
    JOIN,
    LEFT,
    WIN
}

export interface Winner {
    profile: ProfileData,
    word: string
}


export interface Message {
    profile: ProfileData,
    message: string
}

export interface Player extends ProfileData{
    role: UserRole,
    wins: number
}