import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'
import Item from 'antd-mobile/lib/popover/Item'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  onTagClick(value) {
    const { selectedValues } = this.state

    // 创建数组
    const newSelectedValues = [...selectedValues]

    if (selectedValues.indexOf(value) <= -1) {
      // 没有当前项的值
      newSelectedValues.push(value)
    } else {
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }

  onCancel = () => {
    this.setState({
      selectedValues: []
    })
  }

  onOk = () => {
    const { type, onSave } = this.props

    onSave(type, this.state.selectedValues)
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const { selectedValues } = this.state
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >{item.label}</span>
      )
    })
  }

  render() {
    const { data: { roomType, oriented, floor, characteristic }, onCancel, type } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    )
  }
}
