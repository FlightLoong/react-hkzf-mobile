import React from 'react'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

// 导入样式文件
import './index.scss'

// 导入antd
import { Flex } from 'antd-mobile'

function SearchHeader({ cityName, history, className }) {
  return (
    <Flex className={['search-box', className || ''].join(' ')}>
      {/* 左侧白色区域 */}
      <Flex className="search">
        {/* 位置 */}
        <div className="location" onClick={() => history.push('/citylist')}>
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div className="form" onClick={() => history.push('/search')}>
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>

      {/* 右侧地图图标 */}
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

// 添加属性校验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default withRouter(SearchHeader)
