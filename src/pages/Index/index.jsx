import React from 'react'

// 导入组件
import { Carousel, WingBlank, Flex, Grid } from 'antd-mobile'

// 导入顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'

// 导入axios
// import axios from 'axios'
import { API } from '../../utils/api.js'
// 导入 BASE_URL
import { BASE_URL } from '../../utils/url.js'

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式文件
import './index.scss'

// 导入utils中获取定位城市的方法
import { getCurrentCity } from '../../utils'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

export default class Index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    IndexFlag: false,
    // 租房小组数据
    groups: [],
    // 最新资讯
    news: [],
    curCityName: ''
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const res = await API.get('/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body
      }
    }, () => {
      this.setState({
        IndexFlag: true
      })
    })
  }

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })

    this.setState({
      groups: res.data.body
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await API.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')

    this.setState({
      news: res.data.body
    })
  }

  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 根据 IP 地址获取城市信息
    // const myCity = new window.BMap.LocalCity()

    // myCity.get(async (res) => {
    //   const cityName = res.name
    //   const { data: areares } = await axios.get(`http://118.190.160.53:8009/area/info?name=${cityName}`)

    //   this.setState(() => {
    //     return {
    //       curCityName: areares.body.label
    //     }
    //   })
    // })

    const curCity = await getCurrentCity()
    this.setState({
      curCityName: curCity.label
    })
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
          src={BASE_URL + item.imgSrc}
          style={{ width: '100%', verticalAlign: 'top' }}
          alt=""
        />
      </a>
    ))
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={BASE_URL + item.imgSrc}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          <Carousel infinite autoplay={this.state.IndexFlag} Interval={3000}>
            {this.renderSwipers()}
          </Carousel>

          {/* 搜索框 */}
          <SearchHeader cityName={ this.state.curCityName }></SearchHeader>
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={BASE_URL + item.imgSrc} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
