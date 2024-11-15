import React, {useCallback, useEffect, useRef, useState} from 'react';
import CreatorPaint from '../components/paint/creatorPaint/CreatorPaint';
import PlayerPaint from '../components/paint/PlayerPaint';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {Page, setGameId, setPage, UserRole} from "../../../store/slices/appStateSlice";
import Chat from "../components/chat/Chat";
import WinModal from '../components/modal/WinModal';
import ControlWord from '../components/controlWord/ControlWord';
import {Message, MessageType, Player} from "../types";
import {DNA, InfinitySpin} from "react-loader-spinner";
import PlayersList from "../components/players/PlayersList";
import Menu from "../components/menu/Menu";
import {encryptJSON, decryptJSON} from '../../../utils/encrypt';
import {showMessage} from '../../../components/alertModal/AlertModal';
import "./index.css";

const Game = () => {

    const dispatch = useDispatch();
    const {gameId, role, profile} = useSelector((state: RootState) => state.appStateSlice);

    const [loading, setLoading] = useState(true);

    const word = useRef(null);
    const socket = useRef<WebSocket>(null);
    const disconnectTimer = useRef<ReturnType<typeof setTimeout>>();

    const paintRef = useRef(null);
    const chatRef = useRef(null);
    const winModalRef = useRef(null);
    const controlWordRef = useRef(null);
    const playersListRef = useRef(null);

    useEffect(() => {
        if (gameId) {
            let messages: Array<Message> = [];
            let players: Array<Player> = [];

            socket.current = new WebSocket(`ws://localhost:8000/ws/chat/${gameId}/`);
            socket.current.onclose = () => {
                showMessage("Connection reset");
                dispatch(setPage(Page.AUTH));
            };

            socket.current.onmessage = ({data}) => {
                const {messageType, ...props} = decryptJSON(data);
                if (messageType === MessageType.PAINT) {
                    if (paintRef.current?.paint) {
                        paintRef.current?.paint(props.x, props.y, props.event, props.color, props.eraser);
                    }
                } else if (messageType === MessageType.MESSAGE) {
                    chatRef.current.addMessage(props.message, props.profile);
                    messages.push(props);
                    if (role === UserRole.CREATOR && props.message === word.current) {
                        socket.current.send(encryptJSON({
                            messageType: MessageType.WIN,
                            profile: props.profile,
                            word: word.current
                        }));
                    }
                } else if (messageType === MessageType.JOIN && profile.id !== props.profile.id) {
                    const player: Player = {
                        name: props.profile.name,
                        id: props.profile.id,
                        role: props.role,
                        wins: props.wins
                    };
                    playersListRef.current.addPlayer(player);
                    players.push(player);

                    if (role === UserRole.CREATOR) {
                        // get canvas image as array buffer,messages history,players and send via websocket
                        paintRef.current.toBlob((blob) => {
                            const fileReader = new FileReader();
                            fileReader.onload = () => {
                                socket.current.send(encryptJSON({
                                    messageType: MessageType.LOAD_DATA,
                                    image: Array.from(new Uint8Array(fileReader.result as ArrayBuffer)),
                                    consumer: props.profile.id,
                                    messages,
                                    players
                                }));
                            };
                            fileReader.readAsArrayBuffer(blob);
                        });
                    }
                } else if (messageType === MessageType.WIN) {
                    // add wins
                    players = players.map(v => {
                        if (v.id === props.profile.id) {
                            v.wins = v.wins + 1
                        }
                        return v;
                    });
                    playersListRef.current.setPlayers(players);

                    messages = [];
                    chatRef.current.setMessages(messages);

                    word.current = null;

                    paintRef.current.reset();
                    setTimeout(() => {
                        paintRef.current.reset();
                    }, 1000);

                    if (role === UserRole.CREATOR) {
                        paintRef.current.disable();
                    }

                    controlWordRef.current?.showSettingWord();

                    winModalRef.current.open(props);
                    setTimeout(() => {
                        winModalRef.current.close();
                    }, 3000);
                } else if (messageType === MessageType.CLOSE) {
                    if (role === UserRole.PLAYER) {
                        showMessage("Creator left the session")
                    }
                    dispatch(setPage(Page.AUTH));
                } else if (messageType === MessageType.LOAD_DATA && props.consumer === profile.id && role === UserRole.PLAYER) {
                    clearTimeout(disconnectTimer.current);
                    setLoading(false);

                    const buffer: Uint8Array = Uint8Array.from(props.image);
                    const blob = new Blob([buffer]);
                    paintRef.current?.drawImage(blob);
                    chatRef.current.setMessages(props.messages);
                    players = props.players;
                    playersListRef.current.setPlayers(props.players);
                } else if (messageType === MessageType.LEFT) {
                    players = players.filter(v => v.id !== props.id);
                    playersListRef.current.deletePlayer(props.id);

                    if (props.id === profile.id) {
                        dispatch(setPage(Page.AUTH));
                    }
                }
            };

            socket.current.onopen = () => {
                if (role === UserRole.PLAYER) {
                    socket.current.send(encryptJSON({
                        messageType: MessageType.JOIN,
                        profile,
                        role,
                        wins: 0,
                    }));

                    disconnectTimer.current = setTimeout(() => {
                        showMessage("There is no session with this id")
                        dispatch(setPage(Page.AUTH));
                    }, 3000);
                } else if (role === UserRole.CREATOR) {
                    setLoading(false);

                    const player: Player = {
                        name: profile.name,
                        id: profile.id,
                        role,
                        wins: 0,
                    };
                    playersListRef.current.addPlayer(player);
                    players.push(player);
                }
            };

            window.onbeforeunload = () => {
                onClose();
            };

            return () => {
                socket.current.close();
                dispatch(setGameId(null));
                window.onbeforeunload = null;
            };
        }
    }, [gameId]);

    const onWordSet = useCallback(() => {
        if (role === UserRole.CREATOR) {
            paintRef.current.enable();
        }
    }, [role]);

    const onSkipWord = useCallback(() => {
        socket.current.send(encryptJSON({
            messageType: MessageType.WIN,
            profile: {
                name: "No body"
            },
            word: word.current
        }));
    }, []);

    const onClose = useCallback(() => {
        if (role === UserRole.CREATOR) {
            socket.current.send(encryptJSON({messageType: MessageType.CLOSE}));
        } else {
            socket.current.send(encryptJSON({messageType: MessageType.LEFT, id: profile.id}));
        }
    }, [role, profile]);

    const deletePlayer = useCallback((id: string) => {
        if (role === UserRole.CREATOR) {
            socket.current.send(encryptJSON({messageType: MessageType.LEFT, id}));
        }
    }, [role]);

    return (
        <>
            {!loading ?
                <>
                    <div className={"game-container"}>
                        <PlayersList deletePlayer={deletePlayer} ref={playersListRef}/>
                        <div className={"paint-container"}>
                            {role === UserRole.PLAYER ? <PlayerPaint ref={paintRef}/> :
                                <CreatorPaint socket={socket} ref={paintRef}/>}
                        </div>
                        <div className={"right-side-container"}>
                            <Menu onClose={onClose}/>
                            <Chat ref={chatRef} socket={socket}/>
                            {
                                role === UserRole.CREATOR &&
                                <ControlWord
                                    onSkipWord={onSkipWord}
                                    onWordSet={onWordSet}
                                    ref={controlWordRef}
                                    word={word}
                                />
                            }
                        </div>
                        <WinModal ref={winModalRef}/>
                    </div>
                </>
                :
                <InfinitySpin
                    width="200"
                    color="var(--main-pink)"
                />
            }
        </>
    )
};

export default Game;