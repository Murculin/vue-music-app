import * as types from './mutation-types'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite, clearPlay } from '@/assets/js/cache'
// 随机取 min-max 之间的正数
function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 洗牌算法
function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i]
    let j = getRandom(0, i)
    arr[i] = arr[j]
    arr[j] = a
  }
  return arr
}
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  // 获得歌曲列表的拷贝
  let newlist = [...list]
  commit(types.SET_SEQUENCE_LIST, newlist)
  if (state.mode === 2) { // 随机模式
    newlist = shuffle(newlist)
    // 找到洗乱后当前播放歌曲的新index
    index = newlist.findIndex((item) => {
      return item.id === list[index].id
    })
    commit(types.SET_PLAYLIST, newlist)
  } else {
    commit(types.SET_PLAYLIST, newlist)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 向播放列表中插入歌曲
export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插歌曲并返回索引
  let fpIndex = playlist.findIndex((item) => {
    return item.id === song.id
  })
  // 在当前播放歌曲之后插入待插歌曲
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 待插歌曲已经存在则将原位置的那首移出列表
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  setTimeout(() => {
    commit(types.SET_FULL_SCREEN, true)
  }, 50)
  commit(types.SET_PLAYING_STATE, true)
}

export const pushSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let fpIndex = playlist.findIndex((item) => {
    return item.id === song.id
  })
  if (fpIndex > -1) {
    return
  }
  playlist.push(song)
  sequenceList.push(song)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (pIndex < currentIndex || currentIndex === playlist.length) { // 播放最后一首歌时点删除，跳转到上一首
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const clearSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_FULL_SCREEN, false)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const clearPlayHistory = function ({ commit }) {
  commit(types.SET_PLAY_HISTORY, clearPlay())
}

export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
