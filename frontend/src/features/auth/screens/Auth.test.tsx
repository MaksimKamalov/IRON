import {act, fireEvent, waitFor} from "@testing-library/react";
import React, {useRef} from "react";
import Auth from "./Auth";
import {useAlert} from 'react-alert'
import {renderWithProviders} from "../../../utils/testing";
import {configureStore} from "@reduxjs/toolkit";
import appStateSlice, {Page} from "../../../store/slices/appStateSlice";
import { useForm } from "react-hook-form";
import '@testing-library/jest-dom'

const mockUseAlert = jest.fn();

jest.mock('react-alert', () => ({
    useAlert: () => ({show: mockUseAlert})
}));

describe('Auth', () => {
    it('check error message when nickname is empty and play called', async () => {
        const {getByTestId} = renderWithProviders(
            <Auth/>
        );

        await waitFor(() => {
            fireEvent.click(getByTestId("button-play"));

            expect(mockUseAlert).toBeCalled();
        });
    });
    it('check session key modal appear when nickname is not empty and play called', async () => {
        const {getByTestId} = renderWithProviders(
            <Auth/>
        );

        await waitFor(() => {
            fireEvent.input(getByTestId("nickname-field"), {
                target: {
                    value: "test",
                },
            });

            fireEvent.click(getByTestId("button-play"));

            expect(getByTestId("session-key-modal")).toBeInTheDocument();
        });
    });
    it('check error message when nickname is empty and create called', async () => {
        const {getByTestId} = renderWithProviders(
            <Auth/>
        );

        await waitFor(() => {
            fireEvent.click(getByTestId("button-create"));

            expect(mockUseAlert).toBeCalled();
        });
    });
    it('check game screen appear when nickname is not empty and create called', async () => {
        const store = configureStore({
            reducer: {
                appStateSlice: appStateSlice
            }
        });

        const {getByTestId} = renderWithProviders(
            <Auth/>,
            store
        );

        await waitFor(() => {
            fireEvent.input(getByTestId("nickname-field"), {
                target: {
                    value: "test",
                },
            });

            fireEvent.click(getByTestId("button-create"));

            expect(store.getState().appStateSlice.page).toEqual(Page.GAME);
        });
    });
});