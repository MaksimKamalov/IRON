import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Player} from "../../types";
import PlayersListItem from './playersListItem/PlayersListItem';
import "./index.css";

interface Props {
    deletePlayer: (id: string) => void;
}

const PlayersList = forwardRef(({deletePlayer}: Props, ref) => {

    const [players,setPlayers] = useState<Array<Player>>([]);

    useImperativeHandle(ref,() => {
        return {
            addPlayer(player: Player) {
                if(player) {
                    setPlayers((prev) => {
                        return [...prev, player]
                    })
                }
            },
            setPlayers(players: Array<Player>) {
                setPlayers(players);
            },
            deletePlayer(id: string) {
                setPlayers((prev) => {
                    return prev.filter(v => v.id!==id);
                })
            }
        }
    });
    return (
        <>
            <div className='playersListContainer'>
                {players.map(v => <PlayersListItem deletePlayer={deletePlayer} player={v}/>)}
            </div>
        </>
    )
});

export default PlayersList;