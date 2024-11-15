import React from "react";
import AlertModal, { showMessage } from "./AlertModal";
import { render } from '@testing-library/react'; 
import { act } from "react-dom/test-utils";
import '@testing-library/jest-dom'

describe('AlertModal', () => { 
    it('check message correct show', () => { 
        const {getByText} = render(
            <AlertModal />
        );
        act(() => {
            showMessage("test")
        });
        expect(getByText("test")).toBeInTheDocument(); 
    }); 
    it('check message correct hide',async () => { 
        
        const {getByText} = render(
            <AlertModal />
        );
        act(() => {
            showMessage("test")
        })
        await act(async () => {
            new Promise((r) => setTimeout(() => {
            expect(getByText("test")).not.toBeInTheDocument(); 
        }, 3000));
        });
    }); 
    it('check second message visible when multiple messages show', () => { 
        const {getByText} = render(
            <AlertModal />
        );
        act(() => {
            showMessage("test")
            showMessage("test1")
        })
        expect(getByText("test1")).toBeInTheDocument(); 
    }); 
    it('check blank message not show', () => { 
        const {getByText} = render(
            <AlertModal />
        );
        act(() => {
            showMessage("   ")
        })
        expect(() => getByText("   ")).toThrow(); 
    }); 
    it('check null message not show', () => { 
        const {getByText} = render(
            <AlertModal />
        );
        act(() => {
            showMessage(null)
        })
        expect(() => getByText(null)).toThrow(); 
    }); 
  });