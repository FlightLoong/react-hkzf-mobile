import React, { Component } from 'react'

// 导入自定义的axios
import { API } from '../../../../utils/api'

// 导入 react-spring 动画库组件
import { Spring } from 'react-spring/renderprops'

// 导入组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 展示或隐藏的状态
    openType: '',
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
  }

  componentDidMount() {
    // 获取到 body
    this.htmlBody = document.body
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
    // 给 body 添加样式
    this.htmlBody.className = 'body-fixed'

    // 标题选中状态对象和筛选条件的选中值对象
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象

    Object.keys(titleSelectedStatus).forEach(key => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值。
      console.log(key, type)
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return
      }

      // 其他标题：
      const selectedVal = selectedValues[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 取消或隐藏遮罩层
  onCancel = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type]
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState(() => {
      return {
        openType: '',
        // 更新菜单高亮状态数据
        titleSelectedStatus: newTitleSelectedStatus
      }
    })
  }

  // 点确定按钮取消或隐藏遮罩层
  onSave = (type, value) => {
    // console.log(type, value)
    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = value
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }

    // 筛选条件数据
    const filters = {}
    // 解构筛选数据
    const { area, mode, price, more } = newSelectedValues
    // 取到区域关键字
    const areaKey = area[0]
    // 区域的值
    let areaValue = 'null'
    // 处理区域的取值
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    // 将处理好的区域数据添加到 filter 中
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多筛选条件 more
    filters.more = more.join(',')

    this.props.onFilter(filters)

    // console.log(filters)

    this.setState({
      openType: '',
      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]

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
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }

  // 渲染 FilterMore 组件的方法
  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state

    if (openType !== 'more') {
      return null
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    const defaultValue = selectedValues.more

    return <FilterMore data={data} type={openType} onCancel={this.onCancel} onSave={this.onSave} defaultValue={defaultValue} />
  }

  // 渲染遮罩层div
  renderMask() {
    const { openType } = this.state

    const isHide = openType === 'more' || openType == ''

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {
          props => {
            // opacity 等于 0 ，说明遮罩层动画完成已经隐藏
            if (props.opacity === 0) {
              return null
            }

            return (
              <div
                style={props}
                className={styles.mask}
                onClick={() => this.onCancel(openType)}
              />
            )
          }
        }
      </Spring>
    )

    // if (openType === 'more' || openType === '') {
    //   return null
    // }

    // return (
    //   <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
    //     {
    //       props => (
    //         <div
    //           style={props}
    //           className={styles.mask}
    //           onClick={() => this.onCancel(openType)}
    //         />
    //       )
    //     }
    //   </Spring>
    // )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
