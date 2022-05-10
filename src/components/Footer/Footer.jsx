import React, { useState } from 'react'
import classes from './Footer.module.css'

export default function Footer({change, color}) {
    const [toggleState, setToggleState] = useState(1)
    const toggleTab = (index) => {
        setToggleState(index)
        change(index)
    }

  return (
    <div className={classes.Footer}>
        <div 
            style={{backgroundColor: color}} 
            className={toggleState === 1 ? `${classes.tabs} ${classes.active}` : `${classes.tabs}`} 
            onClick={() => toggleTab(1)}
        >
            News
        </div>
        <div 
            style={{backgroundColor: color}} 
            className={toggleState === 2 ? `${classes.tabs} ${classes.active}` : `${classes.tabs}`} 
            onClick={() => toggleTab(2)}
        >
            Themes
        </div>
    </div>
  )
}
