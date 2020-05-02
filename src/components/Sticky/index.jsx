import React, { Component, createRef } from 'react'

import PropTypes from 'prop-types'

// 导入样式表
import styles from './index.module.css'

export default class Sticky extends Component {
  // 创建 ref 对象
  placeholder = createRef()
  content = createRef()

  handleScroll = () => {
    const { height } = this.props
    // 获取 DOM 对象
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    // 获取筛选栏占位元素当前位置
    const { top } = placeholderEl.getBoundingClientRect()

    if (top < 0) {
      // 吸顶
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = `${height}px`
    } else {
      // 取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}
