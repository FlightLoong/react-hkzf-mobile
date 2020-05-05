import React, { lazy, Suspense } from 'react'
// 导入路由
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

// // 导入组件
// import CityList from './pages/CityList/index.jsx'
// import Home from './pages/Home/index.jsx'
// import Map from './pages/Map/index.jsx'
// // 房源详情组件
// import HouseDetail from './pages/HouseDetail/index.jsx'
// // 登录
// import Login from './pages/Login'
// // 注册
// import Registe from './pages/Registe'

// // 房源发布
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'

// 导入鉴权组件
import AuthRoute from './components/AuthRoute/index.jsx'

// 导入组件
const CityList = lazy(() => import('./pages/CityList/index.jsx'))
const Home = lazy(() => import('./pages/Home/index.jsx'))
const Map = lazy(() => import('./pages/Map/index.jsx'))
// 房源详情组件
const HouseDetail = lazy(() => import('./pages/HouseDetail/index.jsx'))
// 登录
const Login = lazy(() => import('./pages/Login'))
// 注册
const Registe = lazy(() => import('./pages/Registe'))

// 房源发布
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))



function App() {
  return (
    <Router>
      <Suspense fallback={<div className="route-loading">loading</div>}>
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

          {/* 配置登录后，才能访问的房源发布页面 */}
          <AuthRoute exact path="/rent" component={Rent} />
          <AuthRoute path="/rent/add" component={RentAdd} />
          <AuthRoute path="/rent/search" component={RentSearch} />
        </div>
      </Suspense>
    </Router>
  )
}

export default App
