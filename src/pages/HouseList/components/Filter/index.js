import React, { Component } from 'react'

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
    titleSelectedStatus
  }

  // 点击标题菜单实现高亮
  onTitleClick = (type) => {
    // console.log(type)
    this.setState(prevState => {
      return {
        titleSelectedStatus: {
          ...prevState.titleSelectedStatus,
          [type]: true
        }
      }
    })
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
