import React from 'react'

// 导入样式
import './index.scss'

export default class Map extends React.Component {
  componentDidMount() {
    // 初始化实例
    const map = new window.BMap.Map("container")

    // 初始化中心点
    const point = new window.BMap.Point(116.404, 39.915)

    // 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="map">
        <div id="container"></div>
      </div>
    )
  }
}
