import axios from 'axios'

// 每页的数据量
const LIMIT = 30


// 分类歌手列表
export function getSingerList (code=1001, page=1) {
  const limit = page * LIMIT
  const url = `api/artist/list?cat=${code}&limit=${limit}`
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      }
    })
  })
}

// 歌手详情
export function getSingerInfo (id) {
  const url = `api/artists?id=${id}`
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      }
    })
  })
}