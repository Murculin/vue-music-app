import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Toast } from 'mint-ui'

export const playlistMixin = {
  computed: {
    ...mapGetters({
      playlist: 'getPlaylist'
    })
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const favoriteMixin = {
  computed: {
    ...mapGetters({
      favoriteList: 'getFavoriteList'
    })
  },
  methods: {
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
        Toast({
          message: '已移出喜爱歌曲列表',
          duration: 1000
        })
      } else {
        this.saveFavoriteList(song)
        Toast({
          message: '已加入喜爱歌曲列表',
          duration: 1000
        })
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
