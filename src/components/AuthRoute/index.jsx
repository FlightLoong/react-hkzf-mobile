import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth.js'

// 创建函数组件
const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      // 是否登录
      const isLogin = isAuth()
      if (isLogin) {
        // 登录状态
        return <Component {...props} />
      } else {
        // 没有登录
        return <Redirect
          to={{
            pathname: '/login',
            state: {
              from: props.location
            }
          }}
        />
      }
    }} />
  )
}

export default AuthRoute
