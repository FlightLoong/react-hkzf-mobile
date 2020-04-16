import React from 'react'
// 导入路由
import { Route } from 'react-router-dom'

// 导入组件
import News from '../News/index.jsx'
import Index from '../Index/index.jsx'
import HouseList from '../HouseList/index.jsx'
import Profile from '../Profile/index.jsx'

// 导入 antd 组件
import { TabBar } from 'antd-mobile'

// 导入 css 文件
import './index.css'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: this.props.location.pathname
    }
  }

  renderContent() {
    return null
  }

  render() {
    return (
      <div className="home">
        {/* 渲染子路由 */}
        <Route path="/home/news" component={News} />
        <Route path="/home/index" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />

        {/* TabBar 设置 */}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
          <TabBar.Item
            title="首页"
            key="首页"
            icon={<i className="iconfont icon-ind" />}
            selectedIcon={<i className="iconfont icon-ind" />}
            selected={this.state.selectedTab === '/home/index'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/index'
              })

              // 路由切换
              this.props.history.push('/home/index')
            }}
            data-seed="logId"
          >
            {this.renderContent('Life')}
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse" />}
            selectedIcon={<i className="iconfont icon-findHouse" />}
            title="找房"
            key="找房"
            selected={this.state.selectedTab === '/home/list'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/list'
              })
              // 路由切换
              this.props.history.push('/home/list')
            }}
            data-seed="logId1"
          >
            {this.renderContent('Koubei')}
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-infom" />}
            selectedIcon={<i className="iconfont icon-infom" />}
            title="资讯"
            key="资讯"
            selected={this.state.selectedTab === '/home/news'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/news'
              })

              // 路由切换
              this.props.history.push('/home/news')
            }}
          >
            {this.renderContent('Friend')}
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-my" />}
            selectedIcon={<i className="iconfont icon-my" />}
            title="我的"
            key="我的"
            selected={this.state.selectedTab === '/home/profile'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/profile'
              })
              // 路由切换
              this.props.history.push('/home/profile')
            }}
          >
            {this.renderContent('My')}
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}
