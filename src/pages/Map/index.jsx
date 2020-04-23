import React from 'react'

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

    // 初始化中心点
    // const point = new BMap.Point(116.404, 39.915)

    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(label, function (point) {
      if (point) {
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 11)
        // map.addOverlay(new BMap.Marker(point))

        // 添加控件
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        const opts = {
          position: point,    // 指定文本标注所在的地理位置
          offset: new BMap.Size(-35, -35)    //设置文本偏移量
        }

        // 创建文本标注对象
        // 说明：设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
        const label = new BMap.Label('', opts)

        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">航头镇</p>
            <p>100套</p>
          </div>
        `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
          console.log('房源覆盖物被点击了')
        })

        // 将覆盖物添加到地图中
        map.addOverlay(label)
      }
    }, label)
  }

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
