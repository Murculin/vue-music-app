import axios from 'axios'
import { createSearchSong } from '@/assets/js/song'

const LIMIT = 30
const imgurl = `/album?id=32311 .album.picUrl`

export function getHotKey () {
  const url = `api/search/hot`
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      if (res.status === 200) {
        resolve(res.data)
      }
    })
  })
}

export function getSingers (query) {
  const url = `api/search/multimatch?keywords=${query}`
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        if (res.status === 200 && res.data.result.artist) {
          resolve(res.data.result.artist)
        } else {
          resolve([])
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getResult (query, type, page) {
  const offset = (page - 1) * 30
  const url = `api/search?keywords=${query}`
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: {
        offset,
        type
      }
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getSongImg (list) {
  list.forEach(music => {
    const id = music.album.id
    if (!id) {
      return
    }
    const url = `api/album?id=${id}`
    axios.get(url).then(res => {
      if (res.status === 200) {
        music.image = res.data.album.picUrl
      }
    })
  })
}
