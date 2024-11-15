import React, { useCallback } from 'react';
import {Player} from "../../../types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {UserRole} from "../../../../../store/slices/appStateSlice";
import EralashSvg from '../../../../../components/svg/EralashSvg';
import PaltoSvg from '../../../../../components/svg/PaltoSvg';
import TurboSvg from '../../../../../components/svg/TurboSvg';
import AdidasSvg from '../../../../../components/svg/AdidasSvg';
import "./index.css";

interface Props {
    player: Player,
    deletePlayer: (id: string) => void
}

const PlayersListItem: React.FC<Props> = ({player,deletePlayer}) => {

    const {profile,role} = useSelector((state: RootState) => state.appStateSlice);

    const renderAvatar = useCallback(() => {
        if(player.role===UserRole.CREATOR) {
            return <AdidasSvg/>
        } else {
            if(player.wins===0) {
                return <EralashSvg/>
            } else if (player.wins>0 && player.wins<5) {
                return <PaltoSvg/>
            } else if (player.wins>=5) {
                return <TurboSvg/>
            }
        }
    },[]);

    return (
        <div className='playerContainer' key={player.id}>
            <div className='playerAvatar'>
                {renderAvatar()}
            </div>
            <h4 style={{
                margin: "10px 0 5px 0"
            }}>{profile.id===player.id ? player.name + " (You)" : player.name}</h4>
            {player.role!==UserRole.CREATOR && <div style={{display: "flex"}}>
                <h3 style={{color: "var(--main-pink)"}}>Wins: </h3>
                <h3> {player.wins}</h3>
                </div>}
            <p style={{
                color: "var(--main-blue)"
            }}>{player.role}</p>
            {role===UserRole.CREATOR && player.id!==profile.id && <button className='playerDelete' onClick={() => deletePlayer(player.id)}>X</button>}
        </div>
    );
};

export default PlayersListItem;