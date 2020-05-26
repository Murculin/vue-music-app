import axios from 'axios'
// 获取列表中所有歌曲的url
export function processSongsUrl (songs) {
  const url = 'api/song/url'
  // 获取id数组
  const ids = songs.map((song) => {
    return song.id
  })
  return new Promise((resolve, reject) => {
    // 更据id获得包含url列表
    axios.get(url,{
      params: {
        id: ids
      }
    })
    .then((res) => {
      res = res.data
      if (res.code === 200) {
        // 将url与传入的歌曲列表一一绑定
        songs.forEach((song) => {
          const index = res.data.findIndex((item) => {
            return song.id === item.id
          })
          song.url = res.data[index].url
        })
        // 返回带有url的歌曲列表
        resolve(songs)
      }
    })
  })
}