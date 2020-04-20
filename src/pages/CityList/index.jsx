import React from 'react'

// 导入 NavBar组件
import { NavBar } from 'antd-mobile'

// 导入 axios
import axios from 'axios'

// 导入 List 组件
import { List, AutoSizer } from 'react-virtualized'

// 导入样式
import './index.scss'

// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils'

// 数据格式化方法
const formatCityData = list => {
  const cityList = {}

  // 遍历 list 数组
  list.forEach(item => {
    // 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 如果有，直接往该分类中 push 数据
      cityList[first].push(item)
    } else {
      // 如果没有，便创建一个数组，将当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取城市索引数据
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

// 封装处理字母索引的方法
const formatCityIndex = letter => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

export default class CityList extends React.Component {
  state = {
    cityList: {},
    cityIndex: []
  }

  componentDidMount() {
    this.getCityList()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const { data: res } = await axios.get('http://118.190.160.53:8009/area/city?level=1')

    const { cityList, cityIndex } = formatCityData(res.body)

    // 处理城市列表数据
    const hotRes = await axios.get('http://118.190.160.53:8009/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    // 获取当前定位城市
    const curCity = await getCurrentCity()

    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    console.log(cityList, cityIndex, curCity)
    // 1. 将获取到的 cityList 和 cityIndex 添加为组件的状态数据
    this.setState({
      cityList,
      cityIndex
    })
  }

  // 将 rowRenderer 函数，添加到组件中，以便在函数中获取到状态数据 cityList 和 cityIndex
  // 渲染每一行数据的渲染函数
  // 函数的返回值就表示最终渲染在页面中的内容
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引
    isScrolling, // 是否正在滚动中
    isVisible, // 是否在可视区域可见
    style, // 指定每一行的位置 重点属性，一定要参加
  }) => {

    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map(item => (
          <div className="name" key={item.value}>
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
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

        {/* 城市列表结构 */}
        <AutoSizer>
          {/* 2. 修改 List 组件的 rowCount 为 cityIndex 数组的长度 */}
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
