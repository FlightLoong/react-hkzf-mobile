import React from 'react'

// 导入组件
import { Carousel } from 'antd-mobile'

// 导入axios
import axios from 'axios'

export default class Index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: []
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get('http://118.190.160.53:8009/home/swiper')
    this.setState({
      swipers: res.data.body
    })
  }

  componentDidMount() {
    this.getSwipers()
  }

  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212
        }}
      >
        <img
          src={`http://118.190.160.53:8009${item.imgSrc}`}
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  render() {
    return (
      <div className="index">
        <Carousel autoplay infinite autoplayInterval={5000}>
          {this.renderSwipers()}
        </Carousel>
      </div>
    )
  }
}
