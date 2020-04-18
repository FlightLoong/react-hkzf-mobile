import React from 'react'

// 导入 NavBar组件
import { NavBar } from 'antd-mobile'

// 导入样式
import './index.scss'

export default class CityList extends React.Component {
  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
      </div>
    )
  }
}
