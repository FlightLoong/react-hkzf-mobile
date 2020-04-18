import axios from 'axios'

// 创建并导出获取定位城市的函数 getCurrentCity
export const getCurrentCity = () => {
  // 判断 localStorage 中是否有定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city')) || []

  // 如果没有，使用首页中获取定位城市的代码来获取，并且存储到本次存储中
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const curCity = new window.BMap.LocalCity()
      curCity.get(async res => {
        try {
          const { data: result } = await axios.get(`http://118.190.160.53:8009/area/info?name=${res.name}`)
          // 存储到本地存储中
          localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
          // 返回该城市数据
          resolve(result.body)
        } catch (err) {
          // 获取定位城市失败
          reject(err)
        }
      })
    })
  }

  // 如果有，直接返回本地存储中的城市数据
  // 注意：因为上面为了处理异步操作，使用了Promise，因此，为了该函数返回值的统一，此处，也应该使用Promise
  // 因为此处的 Promise 不会失败，所以，此处，只要返回一个成功的Promise即可
  return Promise.resolve(localCity)
}
