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
        <p>根组件</p>

        <ul>
          <li>
            <Link to="/home">项目首页</Link>
          </li>
          <li>
            <Link to="/citylist">城市列表</Link>
          </li>
        </ul>

        <Route path="/home" component={CityList}></Route>
        <Route path="/citylist" component={Home}></Route>

      </div>
    </Router>
  )
}

export default App
