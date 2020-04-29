import React from 'react'

// 导入 Flex 组件
import  { Flex } from 'antd-mobile'

// 导入顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'

// 导入样式文件
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city')) || []

export default class CityList extends React.Component {
  render () {
    return (
      <div>
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={ () => this.props.history.go(-1) } />
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>
      </div>
    )
  }
}
