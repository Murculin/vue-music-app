<template>
  <slide>
    <MusicList
      :songs="songs"
      :title="singer.name"
      :bgImage="singer.picUrl"
      class="singer-detail"
    />
  </slide>
</template>

<script>
import { getSingerInfo } from 'api/singer.js'
import { processSongsUrl } from 'api/music.js'
import { creatSong } from '@/assets/js/song'
import { mapGetters } from 'vuex'
import MusicList from 'common/music-list/MusicList'
import Slide from 'common/animation/slide'

export default {
  components: {
    MusicList,
    Slide
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters({
      singer: 'getSinger'
    })
  },
  created () {
    this._getSingerInfo()
  },
  methods: {
    async _getSingerInfo () {
      const res = await getSingerInfo(this.$route.params.id)
      const songs = res.hotSongs.map(music => {
        return creatSong(music)
      })
      this.songs = await processSongsUrl(songs)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
