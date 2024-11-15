import React, {
    forwardRef,
    MutableRefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import {MessageType} from "../../../types";
import { encryptJSON } from '../../../../../utils/encrypt';
import "./index.css";

interface Props {
    socket: MutableRefObject<WebSocket>
}

const colors = ["black","white","blue","red","green","yellow","purple","pink"];

const CreatorPaint = forwardRef(({socket}: Props, ref) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D>(null);

    const [drawing, setDrawing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [isBrush,setIsBrush] = useState(true);
    const [color,setColor] = useState("black");

    useImperativeHandle(ref, () => {
        return {
            reset() {
                ctxRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            },
            enable() {
                setDisabled(false);
            },
            disable() {
                setDisabled(true);
            },
            toBlob(callback: (blob: Blob) => void) {
                canvasRef.current.toBlob(callback);
            }
        }
    });

    useEffect(() => {
        handleBrushType();
    },[isBrush]);

    useEffect(() => {
        ctxRef.current = canvasRef.current.getContext("2d");

        handleBrushType();

        window.onmouseup = () => endDrawing();

        return () => window.onmouseup = null;
    }, []);

    const startDrawing = useCallback((e) => {
        if(!disabled) {
            ctxRef.current?.beginPath();
            ctxRef.current?.moveTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );

            if (socket.current.readyState === socket.current.OPEN) {
                socket.current.send(encryptJSON({
                    messageType: MessageType.PAINT,
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                    color,
                    event: "moveTo",
                    eraser: !isBrush
                }));
            }

            setDrawing(true);
        }
    }, [disabled,color]);

    const draw = useCallback((e) => {
        if (drawing && !disabled) {
            ctxRef.current?.lineTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );

            ctxRef.current?.stroke();

            if (socket.current.readyState === socket.current.OPEN) {
                socket.current.send(encryptJSON({
                    messageType: MessageType.PAINT,
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                    color,
                    event: "lineTo",
                    eraser: !isBrush
                }));
            }
        }
    }, [drawing,disabled,isBrush]);

    const endDrawing = useCallback(() => {
        setDrawing(false);
        ctxRef.current?.closePath();
    }, []);

    const handleBrushType = useCallback(() => {
        if(ctxRef.current) {
            if(isBrush) {
                ctxRef.current.globalCompositeOperation = "source-over";
                ctxRef.current.lineWidth = 3;
            } else {
                ctxRef.current.globalCompositeOperation = "destination-out";
                ctxRef.current.lineWidth = 20;
            }
        }
    },[isBrush]);

    const changeBrushType = useCallback(() => {
        setIsBrush(!isBrush);
    },[isBrush]);

    const renderColor = useCallback((color) => {
        return <div className='color_container'>
            <button onClick={() => handleColor(color)} className='color_button' style={{
                background: color
            }}></button>
        </div>
    },[]);

    const handleColor = useCallback((color) => {
        setColor(color);
        ctxRef.current.strokeStyle = color;
    },[]);

    return (
        <>
                <div className='draw_menu'>
                    <button className='brush-change' onClick={changeBrushType}>{isBrush ? "Eraser" : "Brush"}</button>
                    <div style={{
                        display: "flex"
                    }}>
                        {colors.map(v => renderColor(v))}
                    </div>
                </div>
                <canvas
                    className='paint'
                    id={"canvas_creator"}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                    width={"694px"}
                    height={"494px"}
                />
        </>
    )
});

export default CreatorPaint;