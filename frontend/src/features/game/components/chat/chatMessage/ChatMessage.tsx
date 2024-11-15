import React, { useCallback, useState } from 'react';
import {Message} from "../../../types";
import "./index.css";

interface Props {
    message: Message
}

const ChatMessage: React.FC<Props> = ({message}) => {
    return (
        <>
            <div key={message.profile.name + "" + message.message} className={"message-container"}>
                <h4>{message.profile.name}:</h4>
                <p style={{
                    marginLeft: "3%"
                }}>{message.message}</p>
            </div>
        </>
    )
}

export default ChatMessage;