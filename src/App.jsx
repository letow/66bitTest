import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PullToRefresh from 'react-simple-pull-to-refresh';

function App() {
  const [news, setNews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [tabName, setTabName] = useState('News')
  const [loadingTheme, setLoadingTheme] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [themeName, setThemeName] = useState(() => {
    return JSON.parse(localStorage.getItem('theme')) !== null ? JSON.parse(localStorage.getItem('theme')).name : 'dark'
  })
  const [theme, setTheme] = useState(() => {
    return JSON.parse(localStorage.getItem('theme')) 
    ||
    {id: 0,
    name: '',
    mainColor: '',
    secondColor: '',
    title: '',
    textColor: ''}
  })
  

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
    if(refreshing){
      axios.get('https://frontappapi.dock7.66bit.ru/api/news/get?count=10&page='+currentPage)
        .then(response => {
          setNews([...response.data])
          setCurrentPage(prevState => prevState + 1)
        })
        .finally(() => {setRefreshing(false)})
    }
  })

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
        applyThemeChanges(response.data)
      })
      .finally(() => setLoadingTheme(false))
    }
  },[loadingTheme])

  const doRefresh = () => {
    setRefreshing(true)
  }

  const changeTheme = (el) => {
    setLoadingTheme(true)
    setThemeName(el.target.id)
  }

  const applyThemeChanges = (data) => {
    document.body.style.color = data.textColor
    document.body.style.backgroundColor = data.mainColor
    let posts = document.getElementsByClassName('newsPost')
    for (let i = 0; i < posts.length; i++){
      posts[i].style.border = `1px solid ${data.secondColor}`
    }
    localStorage.setItem('theme', JSON.stringify(data))
  }

  const scrollHandler = e => {
    if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100)
    setFetching(true)
  }

  const changeTabName = (index) => {
    index === 1 ? setTabName('News') : setTabName('Themes')
  }

  const refreshHandler = function() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(doRefresh())
      }, 100)
    })
  }
  return (
    <div className="App">
      <Header
        tabName={tabName}
        refresh={doRefresh}
        color={theme.secondColor}
        textColor={theme.textColor}
      />
      <Footer
        change={changeTabName}
        color={theme.secondColor}
      />
      <PullToRefresh 
        onRefresh={refreshHandler} 
        className='pullWrapper' 
      >
        <div className="wrapper">
          <div className={tabName === 'News' ? 'newsActive' : 'news'}>
            {news.map(news => 
              <div 
                style={ {border: `1px solid ${theme.secondColor}`}} 
                className="newsPost" 
                key={news.id}
              >
                <h2 className="title">{news.title}</h2>
                <p className="content">{news.content}</p>
              </div>
            )}
          </div>
          <div className={tabName === 'Themes' ? 'themesActive' : 'themes'}>
            <div className="themesBtns">
              <input type="radio" name='theme' id='dark' onClick={changeTheme} />
              <label htmlFor="dark" className='themeItem' id='darkLabel'>Dark theme</label>
              <input type="radio" name='theme' id='light' onClick={changeTheme} />
              <label htmlFor="light" className='themeItem' id='lightLabel'>Light theme</label>
              <input type="radio" name='theme' id='blue' onClick={changeTheme} />
              <label htmlFor="blue" className='themeItem' id='blueLabel'>Blue theme</label>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}

export default App;
