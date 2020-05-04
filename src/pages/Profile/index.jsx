import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/url.js'
import { API } from '../../utils/api.js'
import { isAuth, getToken, removeToken } from '../../utils/auth.js'

import styles from './index.module.css'

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'
const alert = Modal.alert

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

export default class Profile extends Component {
  state = {
    isLogin: isAuth(),
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }

  componentDidMount() {
    this.getUserInfo()
  }

  // 退出
  logout = () => {
    alert('提示', '是否确定退出?', [
      { text: '取消' },
      {
        text: '退出',
        onPress: async () => {
          // 调用退出的接口
          await API.post('/user/logout', null, {
            headers: {
              authorization: getToken()
            }
          })

          // 移除本地token
          removeToken()

          // 处理状态
          this.setState({
            isLogin: false,
            userInfo: {
              avatar: '',
              nickname: ''
            }
          })
        }
      }
    ])
  }

  async getUserInfo() {
    if (!this.state.isLogin) {
      return
    }

    const { data: res } = await API.get('/user', {
      headers: {
        authorization: getToken()
      }
    })

    if (res.status === 200) {
      const { avatar, nickname } = res.body
      this.setState({
        userInfo: {
          avatar: avatar === null ? DEFAULT_AVATAR : BASE_URL + avatar,
          nickname
        }
      })
    }
  }

  render() {
    const { history } = this.props

    const { isLogin, userInfo: { avatar, nickname } } = this.state

    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar || DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {/* 登录后展示： */}
              {/* 未登录展示： */}
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                  <div className={styles.edit}>
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >
                      去登录
                  </Button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
