import axios from 'axios'
import { processSongsUrl } from './music'
import { creatSong } from '@/assets/js/song'

class RankList {
  constructor ({ id, idx, name, coverImgUrl, tracks, tags }) {
    this.id = id
    this.idx = idx
    this.name = name
    this.imgUrl = coverImgUrl,
    this.hotList = tracks.slice(0, 3)
    this.tags = tags
  }
}

function getRankList (id = 1) {
  const url = `api/top/list?idx=${id}`
  return axios.get(url)
}

// 排行榜请求列表
let idxArr = [0, 1, 2, 3, 5, 6, 8, 22]
const requestArr = idxArr.map(item => {
  return getRankList(item)
})

// 并发请求多个排行榜数据
export function getRankListAll () {
  return new Promise((resolve, reject) => {
    axios.all(requestArr)
      .then(res => {
        res = res.map((item, index) => {
          item.data.playlist.idx = idxArr[index]
          return new RankList(item.data.playlist)
        })
        resolve(res)
      })
  })
}

export function getRankDetail (idx) {
  const url = `api/top/list?idx=${idx}`
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      if (res.status === 200) {
        let list = res.data.playlist.tracks.slice(0, 50)
        list = list.map(music => creatSong(music))
        resolve(processSongsUrl(list))
      }
    })
  })
}
