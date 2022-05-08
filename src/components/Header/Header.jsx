import React from 'react'
import classes from './Header.module.css'

export default function Header(props) {
  return (
    <div style={{backgroundColor: props.color}} className={classes.Header}>{props.tabName}</div>
  )
}
