import React from 'react';
import "./index.css";

interface Props {
    onClose: () => void;
}

const Menu: React.FC<Props> = ({onClose}) => {
    return (
        <div style={{
            display: "flex",
            position: "absolute",
            top:-35,
            right: 0,
        }}>
            <button className='btn_close' onClick={onClose}><p>X</p></button>
        </div>
    );
};

export default Menu;