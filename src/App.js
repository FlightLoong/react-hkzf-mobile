import React from 'react'
// 导入组件
import { Button } from 'antd-mobile'
// 导入 antd-mobile 样式
import 'antd-mobile/dist/antd-mobile.css'

function App() {
  return (
    <div>
      <p>根组件</p>
      {/* 使用 antd-mobile 中的 Button 组件 */}
      <Button type="warning" disabled>warning disabled</Button>
    </div>
  )
}

export default App
