import React, {
    forwardRef,
    MutableRefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import ChatMessage from './chatMessage/ChatMessage';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import { UserRole} from "../../../../store/slices/appStateSlice";
import {Message, MessageType} from "../../types";
import {ProfileData} from "../../../../types";
import { encryptJSON } from '../../../../utils/encrypt';
import "./index.css"; 

interface Props {
    socket: MutableRefObject<WebSocket>
}

const Chat = forwardRef(({socket}: Props,ref) => {

    const {role,profile} = useSelector((state: RootState) => state.appStateSlice);

    const [messages,setMessages] = useState<Array<Message>>([]);
    const [currentMessage,setCurrentMessage] = useState("");

    useImperativeHandle(ref,() => {
        return {
            addMessage(message: string,profile: ProfileData) {
                if(message) {
                    setMessages((prev) => {
                        return [...prev, {message,profile}]
                    })
                }
            },
            setMessages(messages: Array<Message>) {
                setMessages(messages);
            }
        }
    });

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if(currentMessage.trim()!="") {
            socket.current.send(encryptJSON({
                messageType: MessageType.MESSAGE,
                message: currentMessage,
                profile
            }));
            setCurrentMessage("");
        }
    },[currentMessage,profile]);

    return (
        <>
            <div className='chatPlayer'>
                {messages.map(v => <ChatMessage message={v}/>)}
            </div>
            {role===UserRole.PLAYER && <form onSubmit={onSubmit} className={"message-input"}>
                <input className='messagePlayer' value={currentMessage} placeholder={"Message"} onChange={(e) => setCurrentMessage(e.currentTarget.value)}/>
                <button type='submit'>{">"}</button>
            </form>}
        </>
    )
})

export default Chat;