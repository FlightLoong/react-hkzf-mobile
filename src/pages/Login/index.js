import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import { API } from '../../utils/api.js'

// 导入 withFormik
import { withFormik, Form, Field, ErrorMessage } from 'formik'

import * as Yup from 'yup'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  getUserName = e => {
    this.setState({
      username: e.target.value
    })
  }

  getPassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  handleSubmit = async e => {
    // 阻止表单提交时的默认行为
    e.preventDefault()

    // 获取账号和密码
    const { username, password } = this.state

    // console.log('表单提交了', username, password)
    // 发送请求
    const { data: res } = await API.post('/user/login', {
      username,
      password
    })

    // console.log('登录结果：', res)
    const { status, body, description } = res

    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      this.props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  }

  render() {
    const { username, password } = this.state
    // 通过 props 获取高阶组件传递进来的属性
    // const { values, handleSubmit, handleChange, handleBlur, errors, touched } = this.props
    // console.log(errors, touched)

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                type="text"
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>
            {/* {errors.username && touched.username && (
              <div className={styles.error}>{errors.username}</div>
            )} */}
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                type="possword"
                className={styles.input}
                name="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>
            {/* {errors.password && touched.password && (
              <div className={styles.error}>{errors.password}</div>
            )} */}
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用 withFormik 高阶组件包装 Login 组件
// 为 Login 组件提供属性和方法
Login = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 添加表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),

  // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    // console.log(values)
    // 获取账号和密码
    const { username, password } = values
    // 发送请求
    const { data: res } = await API.post('/user/login', {
      username,
      password
    })

    // console.log('登录结果：', res)
    const { status, body, description } = res

    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)

      if (!props.location.state) {
        // 直接进入到了该页面，调用 go(-1) 返回上一级路由
        props.history.go(-1)
      } else {
        // push：[home, login, map]
        // replace: [home, map]
        // props.history.push(props.location.state.from.pathname)

        // 使用 replace 方法替换 push 方法，这样返回上一页，不会再次跳转到 login 页面
        props.history.replace(props.location.state.from.pathname)
      }
      // props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  }
})(Login)

// 此处返回的是 高阶组件 包装后的组件
export default Login
