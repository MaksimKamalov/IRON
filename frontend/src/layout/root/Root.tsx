import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Page} from "../../store/slices/appStateSlice";
import Auth from "../../features/auth/screens/Auth";
import Game from "../../features/game/screens/Game";
import AlertModal from '../../components/alertModal/AlertModal';

const Root = () => {

    const {page} = useSelector((state: RootState) => state.appStateSlice);


    return (
        <>
            {page===Page.AUTH ? <Auth/> : <Game/>}
        </>
    )

};

export default Root;