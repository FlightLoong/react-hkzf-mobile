import React from 'react'
// 导入路由
import { Route } from 'react-router-dom'

// 导入组件
import News from '../News/index.jsx'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <p>首页</p>

        <Route path="/home/news" component={News}></Route>
      </div>
    )
  }
}
