import { getSongsUrl } from 'api/song'
import { resolve } from 'dns'
import axios from 'axios'

export default class Song {
  constructor ({ id, name, singer, album, image, url }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.image = image
    this.url = url
  }
}

export function creatSong (musicData) {
  return new Song({
    id: musicData.id,
    name: musicData.name,
    singer: getSinger(musicData.ar),
    album: musicData.al,
    image: musicData.al.picUrl,
    url: ''
  })
}

// export function creatSong (musicData) {
//   return new Song({
//     id: musicData.songid,
//     mid: musicData.songmid,
//     name: musicData.songname,
//     singer: getSinger(musicData.singer),
//     album: musicData.albumname,
//     duration: musicData.interval,
//     image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
//     url: `https://thirdparty.gtimg.com/${musicData.songid}.m4a?fromtag=38`
//   })
// }

function getSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

// export function processSongsUrl (songs) {
//   const url = 'api/song/url'
//   let ids = []
//   songs.forEach((song) => {
//     ids.push(song.id)
//   })
//   return new Promise((resolve, reject) => {
//     axios.get(url,{
//       params: {
//         id: ids
//       }
//     }).then((res) => {
//       res = res.data
//       if (res.code === 200) {
//         songs.forEach((item, index) => {
//           item.id = res.data[index].id
//         })
//         resolve(songs)
//       }
//     })
//   })
// }

// function _getSongUrl (list) {
//   let ret = []
//   let idList = []
//   list.forEach((musicData) => {
//     ret.push(creatSong(musicData))
//     idList.push(musicData.id)
//   })
//   this.songs = ret
//   return (
//     axios.get('/api/song/url',{
//       params: {
//         id: idList
//       }
//     })
//   )
// }
// export function processSongsUrl (songs) {
//   if (!songs.length) {
//     return Promise.resolve(songs)
//   }
//   return getSongsUrl(songs).then((purlMap) => {
//     songs = songs.filter((song) => {
//       const purl = purlMap[song.mid]
//       if (purl) {
//         song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
//         return true
//       }
//       return false
//     })
//     return songs
//   })
// }
