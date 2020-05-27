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

// 工厂模式创建音乐
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

export function createSearchSong (musicData) {
  return new Song({
    id: musicData.id,
    name: musicData.name,
    singer: getSinger(musicData.artists),
    album: musicData.album,
    image: musicData.album.picId,
    url: ''
  })
}

// 将包含歌手信息数组拼接成字符串
function getSinger (singer) {
  if (!singer) {
    return ''
  }
  return singer.map(item => {
    return item.name
  }).join('/')
}
