import axios from './axios'

const debug = process.env.NODE_ENV !== 'production'

export function getSwiperList () {
  return new Promise((resolve, reject) => {
    axios.get('/banner').then((res) => {
      resolve(res.data)
    })
  })
}

const limit = 30
export function getDiscList (lasttime) {
  return new Promise((resolve, reject) => {
    axios.get(`/top/playlist/highquality`, {
      params: {
        before: lasttime,
        limit: limit
      }
    }).then((res) => {
      resolve(res.data)
    })
  })
}

export function getPersonalized () {
  return new Promise((resolve, reject) => {
    axios.get('/personalized').then((res) => {
      resolve(res.data)
    })
  })
}

export function getDiscDetail (id) {
  return new Promise((resolve, reject) => {
    const url = '/playlist/detail'
    axios.get(url, {
      params: {
        id
      }
    }).then((res) => {
      resolve(res.data)
    })
  })
}
