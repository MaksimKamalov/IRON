import React, {MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import "./index.css";

interface AlertModalRef {
    show: (message:string) => void;
}

let ref: MutableRefObject<AlertModalRef> = React.createRef();

export const showMessage = (message: string) => {
    ref?.current?.show(message);
};

const AlertModal = () => {

    const [isOpen,setIsOpen] = useState(false);
    const [message,setMessage] = useState(null);

    const modalRef = useRef<AlertModalRef>();
    const timeout = useRef<ReturnType<typeof setTimeout>>(null);

    useImperativeHandle(modalRef,() => {
        return {
            show(message: string) {
                setMessage(message);
                setIsOpen(true);
                timeout.current = setTimeout(() => {
                    setIsOpen(false);
                }, 3000);
            }
        }
    });

    useEffect(() => {
        ref = modalRef;

        return () => {
            clearTimeout(timeout.current);
        }
    },[]);

    return (
        <Dialog
            open={isOpen}
            PaperProps={{
                style: {
                    borderRadius: "30px"
                }
            }}
            onBlur={() => {
                setMessage(null);
            }}
            onClose={() => {
                setIsOpen(false);
            }}
        >
            <DialogContent className='AlertModalContent'>               
                <h4 >
                    {message}
                </h4>
            </DialogContent>                
        </Dialog>
    )
};

export default AlertModal;