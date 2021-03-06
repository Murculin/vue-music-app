function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 乱序
export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let a = _arr[i]
    let j = getRandom(0, i)
    _arr[i] = _arr[j]
    _arr[j] = a
  }
  return _arr
}

// 防抖
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 处理歌词
export function formatLyrics (lyrics) {
  lyrics = lyrics.split('\n')
  let lyricsArr = []
  lyrics.forEach(item => {
    const timeReg = /\[(\d+:\d+\.\d+)\]/
    if (item.match(timeReg)) {
      let time = item.match(timeReg)[1]
      let clause = item.replace(item.match(timeReg)[0], '')
      let min = parseInt(time.split(':')[0])
      let sec = parseFloat(time.split(':')[1])
      time = min * 60 + sec
      let eachLyric = {
        time,
        clause
      }
      lyricsArr.push(eachLyric)
    }
  })
  return lyricsArr
}
