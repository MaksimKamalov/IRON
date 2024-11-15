import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useAlert} from 'react-alert';
import {useDispatch} from "react-redux";
import {Page, setGameId, setPage, setUserRole, UserRole} from "../../../../store/slices/appStateSlice";
import "./index.css"

interface Props {
    updateProfileData: () => void;
}

const SessionKeyModal = forwardRef(({updateProfileData}: Props, ref) => {

    const {control, getValues, formState: {isValid, errors}, trigger, resetField} = useForm({
        mode: "all", defaultValues: {
            code: ""
        }
    });
    const alert = useAlert();

    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            open() {
                setIsOpen(true);
            },
            close() {
                setIsOpen(false);
            }
        }
    });


    useEffect(() => {
        if (!isOpen) resetField("code");
    }, [isOpen]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (!isValid) {
            alert.show(errors[Object.keys(errors)[0]]['message'])
        } else {
            updateProfileData();
            dispatch(setPage(Page.GAME));
            dispatch(setUserRole(UserRole.PLAYER));
            dispatch(setGameId(getValues("code")));
        }
    }, [isValid, errors]);

    return (
        <>
            <Dialog open={isOpen} onFocus={() => {
                trigger();
            }} onClose={() => setIsOpen(false)}
            PaperProps={{
                style: {
                    borderRadius: "30px"
                }
            }}
            className="session-key-modal" 
            >
                <DialogTitle data-testid={"session-key-modal"} id="session-key-modal-title" className="session-key-modal-title">
                    Enter session key
                </DialogTitle>
                <DialogContent className="session-key-modal-content">
                    <form onSubmit={onSubmit}>
                        <Controller
                            control={control}
                            name={"code"}
                            render={({ field }) => <input {...field} className="session-key-modal-input" />} 
                            rules={{
                                validate: {
                                    isNotBlank: v => (v && v.trim() !== "") || "Enter session code"
                                }
                            }}
                        />
                        <button type={"submit"} className="session-key-modal-button session-key-modal-button-primary">Connect</button>
                        <button type={"button"} onClick={() => setIsOpen(false)} className="session-key-modal-button session-key-modal-button-secondary">Cancel</button>
                    </form>
                </DialogContent>

            </Dialog>
        </>
    );
});

export default SessionKeyModal;