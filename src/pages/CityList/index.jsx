import React from 'react'

// 导入 NavBar组件
import { NavBar } from 'antd-mobile'

// 导入 axios
import axios from 'axios'

// 导入样式
import './index.scss'

export default class CityList extends React.Component {
  componentDidMount() {
    this.getCityList()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const { data: res } = await axios.get('http://118.190.160.53:8009/area/city?level=1')
    console.log(res)
  }

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
