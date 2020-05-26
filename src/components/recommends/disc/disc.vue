<template>
  <MusicList
    :bgImage="disc.coverImgUrl || disc.picUrl"
    :title="disc.name"
    :songs="songs"
  ></MusicList>
</template>

<script>
import MusicList from 'common/music-list/MusicList'
import { mapGetters } from 'vuex'
import { getDiscDetail } from 'api/recommend.js'
import { processSongsUrl } from 'api/music.js'
import { creatSong } from '@/assets/js/song'
import axios from 'axios'
export default {
  components:{
    MusicList
  },
  data () {
    return {
      cdinfo: {},
      songs: []
    }
  },
  computed: {
    ...mapGetters({
      disc: 'getDisc'
    })
  },
  created () {
    this.$nextTick(() => {
      this._getDiscDetail() // 获取歌曲列表
    })
  },
  methods: {
    async _getDiscDetail () {
      const res = await getDiscDetail(this.disc.id)
      if(res.code !== 200) {
        return
      }
      const songs = res.playlist.tracks.map((music) => {
        return creatSong(music)
      })
      this.songs = await processSongsUrl(songs)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
