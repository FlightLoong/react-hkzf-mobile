import React from 'react'
import ReactDOM from 'react-dom'

// 导入 antd-mobile 样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入 react-virtualized 组件的样式
import 'react-virtualized/styles.css'

// 导入字体图标库文件
import './assets/fonts/iconfont.css'

// 导入全局样式文件
// 我们写的样式需要放到导入的样式库后面，这样才会生效，我们自己的样式才会覆盖样式库的样式
import './index.css'

// import './utils/url.js'

import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('root'))
