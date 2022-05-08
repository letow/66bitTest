import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const [news, setNews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [tabName, setTabName] = useState('News')
  const [themeName, setThemeName] = useState('dark')
  const [theme, setTheme] = useState({
    id: 0,
    name: '',
    mainColor: '',
    secondColor: '',
    title: '',
    textColor: ''
  })
  const [loadingTheme, setLoadingTheme] = useState(true)

  useEffect(() => {
    if(fetching){
      axios.get('https://frontappapi.dock7.66bit.ru/api/news/get?count=10&page='+currentPage)
        .then(response => {
          setNews([...news, ...response.data])
          setCurrentPage(prevState => prevState + 1)
        })
        .finally(() => setFetching(false))
    }
  }, [fetching])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return function (){
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  useEffect(() => {
    if(loadingTheme){
      axios.get(`https://frontappapi.dock7.66bit.ru/api/theme/get?name=${themeName}`)
      .then(response => {
        setTheme(response.data)
        console.log(theme)
        tema(response.data)
      })
      .finally(() => setLoadingTheme(false))
    }
  },[loadingTheme])

  const changeTheme = (el) => {
    setLoadingTheme(true)
    setThemeName(el.target.id)
  }

  const tema = (data) => {
    document.body.style.color = data.textColor
    document.body.style.backgroundColor = data.mainColor
    let posts = document.getElementsByClassName('newsPost')
    for (let i = 0; i < posts.length; i++){
      posts[i].style.border = `1px solid ${data.secondColor}`
    }
  }

  const scrollHandler = e => {
    if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100)
    setFetching(true)
  }

  const changeTabName = (index) => {
    index === 1 ? setTabName('News') : setTabName('Themes')
  }

  return (
    <div className="App">
      <Header
        tabName={tabName}
        color={theme.secondColor}
      />
      <Footer
        change={changeTabName}
        color={theme.secondColor}
      />
      <div className="wrapper">
        <div className={tabName === 'News' ? 'newsActive' : 'news'}>
          {news.map(news => 
            <div style={ {border: `1px solid ${theme.secondColor}`}} className="newsPost" key={news.id}>
              <h2 className="title">{news.title}</h2>
              <p className="content">{news.content}</p>
            </div>
          )}
        </div>
        <div className={tabName === 'Themes' ? 'themesActive' : 'themes'}>
          <div className="themesBtns">
            <input type="radio" name='theme' id='dark' onClick={changeTheme} defaultChecked />
            <label htmlFor="dark" className='themeItem' id='darkLabel'>Dark theme</label>
            <input type="radio" name='theme' id='light' onClick={changeTheme} />
            <label htmlFor="light" className='themeItem' id='lightLabel'>Light theme</label>
            <input type="radio" name='theme' id='blue' onClick={changeTheme} />
            <label htmlFor="blue" className='themeItem' id='blueLabel'>Blue theme</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
