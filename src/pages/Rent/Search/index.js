import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity } from '../../../utils/city'
import { API } from '../../../utils/api'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  // 定时器id
  timerId = null

  state = {
    searchTxt: '',
    tipsList: []
  }

  // 点击搜索建议列表项
  onTipsClick = (item) => {
    // console.log(item)
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={() => this.onTipsClick(item)}>
        {item.communityName}
      </li>
    ))
  }

  // 获取搜索建议列表
  handleSearchTxt = (value) => {
    this.setState({
      searchTxt: value
    })

    if (!value) {
      return this.setState({
        tipsList: []
      })
    }

    // 开启一次新的定时器之前，先清除上一次的定时器
    clearTimeout(this.timerId)

    this.timerId = setTimeout(async () => {
      const { data: res } = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })

      this.setState({
        tipsList: res.body
      })
    }, 500)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.go(-1)}
          onChange={this.handleSearchTxt}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
