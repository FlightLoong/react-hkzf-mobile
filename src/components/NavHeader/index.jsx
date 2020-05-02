import React from 'react'

import { withRouter } from 'react-router-dom'

import { NavBar } from 'antd-mobile'

import PropTypes from 'prop-types'

// import './index.scss'
import styles from './index.module.css'

function NavHeader({ children, history, onLeftClick, className, rightContent }) {

  // 默认点击行为
  const defaultHandle = () => history.go(-1)

  return (
    <div>
      {/* 顶部导航栏 */}
      <NavBar
        className={[styles.navBar, className || ''].join(' ')}
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={onLeftClick || defaultHandle}
        rightContent={rightContent}
      >
        {children}
      </NavBar>
    </div>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}

export default withRouter(NavHeader) 
