import React from 'react'
// 导入路由
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

// 导入组件
import CityList from './pages/CityList/index.jsx'
import Home from './pages/Home/index.jsx'
import Map from './pages/Map/index.jsx'
// 房源详情组件
import HouseDetail from './pages/HouseDetail/index.jsx'
// 登录
import Login from './pages/Login'
// 注册
import Registe from './pages/Registe'
// 导入鉴权组件
// import AuthRoute from './components/AuthRoute/index.jsx'

function App() {
  return (
    <Router>
      <div className="App">

        {/* 第一种：路由重定向的方式 */}
        {/* <Redirect from="/" to="/home" /> */}

        {/* 第二种：路由重定向的方式 */}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>

        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/map" component={Map}></Route>

        {/* 房源详情的路由规则： */}
        <Route path="/detail/:id" component={HouseDetail}></Route>
        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />
      </div>
    </Router>
  )
}

export default App
