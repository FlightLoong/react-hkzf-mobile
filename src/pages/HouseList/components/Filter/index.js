import React, { Component } from 'react'

// 导入自定义的axios
import { API } from '../../../../utils/api'

// 导入组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: true,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 展示或隐藏的状态
    openType: '',
    // 所有筛选条件数据
    filtersData: {}
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))

    const { data: res } = await API.get(`/houses/condition?id=${value}`)
    console.log(res)

    this.setState({
      filtersData: res.body
    })
  }

  // 点击标题菜单实现高亮
  onTitleClick = (type) => {
    // console.log(type)
    this.setState(prevState => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          [type]: true
        },
        // 展示对话框
        openType: type
      }
    })
  }

  // 取消或隐藏遮罩层
  onCancel = () => {
    this.setState(() => {
      return {
        openType: ''
      }
    })
  }

  // 点确定按钮取消或隐藏遮罩层
  onSave = () => {
    this.setState(() => {
      return {
        openType: ''
      }
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price }
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3

    switch (openType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway]
        cols = 3
        console.log(data)
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return (
      <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
      />
    )
  }

  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          openType === 'area' || openType === 'mode' || openType === 'price' ? (
            <div className={styles.mask} />
          ) : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
