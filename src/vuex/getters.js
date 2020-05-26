export const getSinger = state => state.singer

export const getPlaying = state => state.playing

export const getFullScreen = state => state.fullScreen

export const getPlaylist = state => state.playlist

export const getSequenceList = state => state.sequenceList

export const getMode = state => state.mode

export const getCurrentIndex = state => state.currentIndex

export const getCurrentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const getDisc = state => state.disc

export const getRank = state => state.rank

export const getSearchHistory = state => state.searchHistory

export const getPlayHistory = state => state.playHistory

export const getFavoriteList = state => state.favoriteList
