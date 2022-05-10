import React from 'react'
import classes from './Header.module.css'

export default function Header({tabName, refresh, color, textColor}) {
  const refreshNews = () => {
    refresh()
  }
  return (
    <div style={{backgroundColor: color}} className={classes.Header}>
      <div style={{width: '45px'}}></div>
      {tabName}
      <button style={{color: textColor}} onClick={() => refreshNews()} id={classes.refreshBtn} >&#10227;</button>
    </div>
  )
}
