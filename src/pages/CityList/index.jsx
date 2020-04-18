import React from 'react'

// 导入 NavBar组件
import { NavBar } from 'antd-mobile'

// 导入 axios
import axios from 'axios'

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

export default class CityList extends React.Component {
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
