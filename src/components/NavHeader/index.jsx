import React from 'react'

import { withRouter } from 'react-router-dom'

import { NavBar } from 'antd-mobile'

import PropTypes from 'prop-types'

// import './index.scss'
import styles from './index.module.css'

function NavHeader({ children, history, onLeftClick }) {

  // 默认点击行为
  const defaultHandle = () => history.go(-1)

  return (
    <div>
      {/* 顶部导航栏 */}
      <NavBar
        className={ styles.navbar }
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={onLeftClick || defaultHandle}
      >
        {children}
      </NavBar>
    </div>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}

export default withRouter(NavHeader) 
