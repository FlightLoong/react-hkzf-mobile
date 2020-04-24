import React from 'react'

import axios from 'axios'

// 导入顶部导航组件
import NavHeader from '../../components/NavHeader/index.jsx'

// 导入样式
// import './index.scss'
import styles from './index.module.css'

// 声明一个全局地图变量
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  componentDidMount() {
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    // 初始化实例
    const map = new BMap.Map("container")
    this.map = map

    // 初始化中心点
    // const point = new BMap.Point(116.404, 39.915)

    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(label, async point => {
      if (point) {
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 11)
        // map.addOverlay(new BMap.Marker(point))

        // 添加控件
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        this.renderOverlays(value)

        // const { data: res } = await axios.get(`http://118.190.160.53:8009/area/map?id=${value}`)
        // // console.log(res)

        // res.body.forEach(item => {
        //   // 为每一条数据创建覆盖物
        //   const {
        //     coord: { longitude, latitude },
        //     label: areaName,
        //     count,
        //     value
        //   } = item

        //   // 创建覆盖物
        //   const areaPoint = new BMap.Point(longitude, latitude)

        //   const opts = {
        //     position: areaPoint,    // 指定文本标注所在的地理位置
        //     offset: new BMap.Size(-35, -35)    //设置文本偏移量
        //   }

        //   // 创建文本标注对象
        //   // 说明：设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
        //   const label = new BMap.Label('', opts)

        //   // 给 label 对象添加一个唯一标识
        //   label.id = value

        //   label.setContent(`
        //     <div class="${styles.bubble}">
        //       <p class="${styles.name}">${areaName}</p>
        //       <p>${count}套</p>
        //     </div>
        //   `)

        //   // 设置样式
        //   label.setStyle(labelStyle)

        //   // 添加单击事件
        //   label.addEventListener('click', () => {
        //     console.log('房源覆盖物被点击了', label.id)

        //     // 放大地图，以当前点击的覆盖物为中心放大地图
        //     // 第一个参数：坐标对象
        //     // 第二个参数：放大级别
        //     map.centerAndZoom(areaPoint, 13)

        //     // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
        //     setTimeout(() => {
        //       // 清除当前覆盖物信息
        //       map.clearOverlays()
        //     }, 0)
        //   })

        //   // 将覆盖物添加到地图中
        //   map.addOverlay(label)
        // })
      }
    }, label)
  }

  // 渲染覆盖物方法
  async renderOverlays(id) {
    const { data: res } = await axios.get(`http://118.190.160.53:8009/area/map?id=${id}`)

    const data = res.body

    // 调用 getTypeAndZoom 方法获取级别和类型
    const { nextZoom, type } = this.getTypeAndZoom()

    data.forEach(item => {
      console.log(item)
      console.log(nextZoom, type)
      // 创建覆盖物
      this.createOverlays(item, nextZoom, type)
    })
  }

  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区 --> 11 ，范围 >= 10 < 12
  // 镇 --> 13 , 范围 >= 12 < 14
  // 小区 --> 15，范围 >= 14 < 16
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type

    // console.log('当前地图缩放级别：', zoom)
    if (zoom >= 10 && zoom < 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物（区、镇）
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }

    return {
      nextZoom,
      type
    }
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data

    // 创建覆盖物
    const areaPoint = new BMap.Point(longitude, latitude)

    if (type === 'circle') {
      // 区或镇
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      // 小区
      this.createRect(areaPoint, areaName, count, value)
    }
  }

  // 创建区、镇覆盖物
  createCircle() { }

  // 创建小区覆盖物
  createRect() { }

  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" className={styles.container}></div>
      </div>
    )
  }
}
