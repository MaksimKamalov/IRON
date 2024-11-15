import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {Winner} from "../../types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import './index.css'
import CupSvg from '../../../../components/svg/CupSvg';


const WinModal = forwardRef((props,ref) => {

    const {profile} = useSelector((state: RootState) => state.appStateSlice);

    const [isOpen, setIsOpen] = useState(false);
    const [winner,setWinner] = useState<Winner>(null);

    useImperativeHandle(ref,() => {
        return {
            open(winner: Winner) {
                setIsOpen(true);
                setWinner(winner);
            },
            close() {
                setIsOpen(false);
            }
        }
    });

    return (
        <Dialog
            open={isOpen}
            PaperProps={{
                style: {
                    borderRadius: "30px"
                }
            }}
            onClose={(event,reason) => {
                setIsOpen(false);
                setTimeout(() => {
                    setWinner(null);
                },500);
            }}
        >
            <DialogTitle id="modal-title" >
                <div>
                    <CupSvg></CupSvg>
                </div>
            </DialogTitle>
            <DialogContent className="modal-content">
                <p style={{
                    color: "var(--main-pink)",
                    fontSize: "20px"
                }}>
                    {winner?.profile.id!==profile?.id ? `${winner?.profile.name}` : "You won"}
                    <br/>
                </p>                        
                <p style={{
                    color: "var(--main-green)"
                }}>Word: {winner?.word}</p>
            </DialogContent>
        </Dialog>
    );
});

export default WinModal;