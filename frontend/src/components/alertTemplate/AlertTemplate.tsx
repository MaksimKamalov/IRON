import React from 'react'
import { render } from 'react-dom'
import { Provider as AlertProvider } from 'react-alert'

const AlertTemplate = ({ style, options, message, close }) => (
    <div style={{ 
        ...style, 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        color: "var(--main-pink)",
        padding: '15px', 
        borderRadius: '7px', 
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',   
        border: "2px solid var(--main-pink)"
      }}>      
        <span style={{
          fontSize: "1.2rem"
        }}>{message}</span>
        <button 
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: "var(--main-pink)",
            marginLeft: '10px',
            fontSize: "1.2rem"
          }} 
          onClick={close}
        >
          X
        </button>
      </div>
    )

  export default AlertTemplate;