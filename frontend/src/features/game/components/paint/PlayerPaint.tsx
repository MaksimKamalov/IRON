import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

const PlayerPaint = forwardRef((props, ref) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D>(null);

    useEffect(() => {
        ctxRef.current = canvasRef.current.getContext("2d")
        ctxRef.current.lineWidth = 3;
    },[]);

    useImperativeHandle(ref, () => {
        return {
            paint(x,y,event,color,eraser) {
                if(eraser) {
                    ctxRef.current.globalCompositeOperation = "destination-out";
                    ctxRef.current.lineWidth = 20;
                } else {
                    ctxRef.current.globalCompositeOperation = "source-over";
                    ctxRef.current.lineWidth = 3;
                    ctxRef.current.strokeStyle = color;
                }
                    if (event === "moveTo") {
                        ctxRef.current?.beginPath();
                        ctxRef.current?.moveTo(
                            x,
                            y
                        );
                    } else if (event === "lineTo") {
                        ctxRef.current?.lineTo(
                            x,
                            y
                        );

                        ctxRef.current?.stroke();
                    }
            },
            reset() {
                ctxRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            },
            async drawImage(blob: Blob) {
                const image = new Image();
                image.onload = () => {
                    ctxRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
                };

                image.src = URL.createObjectURL(blob);
            }
        }
    });

    return (
        <>
            <canvas
                className='paint'
                ref={canvasRef}
                width={"694px"}
                height={"494px"}
            />
        </>
    )
});

export default PlayerPaint;