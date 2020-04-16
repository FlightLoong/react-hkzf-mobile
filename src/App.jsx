import React from 'react'
// 导入路由
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// 导入组件
import CityList from './pages/CityList/index.jsx'
import Home from './pages/Home/index.jsx'

function App() {
  return (
    <Router>
      <div>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  )
}

export default App
