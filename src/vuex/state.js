import { loadSearch, loadPlay, loadFavorite } from '@/assets/js/cache.js'

export default {
  playing: false, // 是否播放
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表(排序后)
  sequenceList: [], // 原始播放列表
  mode: 0, // 播放模式 0顺序循环 1随机 2单曲循环
  currentIndex: -1, // 当前播放列表中的第几首
  singer: {},
  disc: {},
  rank: {},
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay(),   //  播放历史
  favoriteList: loadFavorite() // 喜爱歌曲列表
}
