import React from 'react'

// 导入axios
// import axios from 'axios'
import { API } from '../../utils/api.js'

import { Link } from 'react-router-dom'

import { Toast } from 'antd-mobile'

// 导入 BASE_URL
import { BASE_URL } from '../../utils/url.js'

// 导入顶部导航组件
import NavHeader from '../../components/NavHeader/index.jsx'

// 导入 HouseItem 组件
import HouseItem from '../../components/HouseItem'

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
  state = {
    // 小区下的房源列表
    housesList: [],
    // 表示是否展示房源列表
    isShowList: false
  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {
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
      }
    }, label)

    map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }

  // 渲染覆盖物方法
  async renderOverlays(id) {
    try {
      // 开启loading
      Toast.loading('加载中...', 0, null, false)
      const { data: res } = await API.get(`/area/map?id=${id}`)
      // 关闭 loading
      Toast.hide()

      const data = res.body
      // 调用 getTypeAndZoom 方法获取级别和类型
      const { nextZoom, type } = this.getTypeAndZoom()

      data.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
      })
    } catch (e) {
      // 关闭 loading
      Toast.hide()
    }
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
  createCircle(point, name, count, id, zoom) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-35, -35)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${name}</p>
      <p>${count}套</p>
    </div>
  `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', () => {
      // 调用 renderOverlays 方法，获取该区域下的房源数据
      this.renderOverlays(id)

      // 放大地图，以当前点击的覆盖物为中心放大地图
      this.map.centerAndZoom(point, zoom)

      // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
      setTimeout(() => {
        // 清除当前覆盖物信息
        this.map.clearOverlays()
      }, 0)
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }

  // 创建小区覆盖物
  createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-50, -28)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', (e) => {
      // console.log('小区被点击了')
      this.getHousesList(id)

      // 获取当前被点击的小区坐标
      const target = e.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 300) / 2 - target.clientY
      )
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }

  // 获取小区房源数据
  async getHousesList(id) {
    try {
      // 开启loading
      Toast.loading('加载中...', 0, null, false)
      const res = await API.get(`/houses?cityId=${id}`)

      // 关闭 loading
      Toast.hide()

      this.setState({
        housesList: res.data.body.list,
        isShowList: true // 展示房源列表
      })
    } catch (e) {
      // 关闭 loading
      Toast.hide()
    }
  }

  // 封装渲染房屋列表的方法
  renderHousesList() {
    return this.state.housesList.map(item => (
      <HouseItem
        key={item.houseCode}
        src={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
    ))
    // return this.state.housesList.map(item => (
    //   <div className={styles.house} key={item.houseCode}>
    //     <div className={styles.imgWrap}>
    //       <img
    //         className={styles.img}
    //         src={BASE_URL + item.houseImg}
    //         alt=""
    //       />
    //     </div>
    //     <div className={styles.content}>
    //       <h3 className={styles.title}>{item.title}</h3>
    //       <div className={styles.desc}>{item.desc}</div>
    //       <div>
    //         {/* ['近地铁', '随时看房'] */}
    //         {item.tags.map((tag, index) => {
    //           const tagClass = 'tag' + (index + 1)
    //           return (
    //             <span
    //               className={[styles.tag, styles[tagClass]].join(' ')}
    //               key={tag}
    //             >
    //               {tag}
    //             </span>
    //           )
    //         })}
    //       </div>
    //       <div className={styles.price}>
    //         <span className={styles.priceNum}>{item.price}</span> 元/月
    //       </div>
    //     </div>
    //   </div>
    // ))
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>

        {/* 地图容器元素 */}
        <div id="container" className={styles.container}></div>

        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
