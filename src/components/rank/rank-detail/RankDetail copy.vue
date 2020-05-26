<template>
  <music-list
    :title="rank.topTitle"
    :bgImage="rank.picUrl"
    :songs="songs"
  ></music-list>
</template>

<script>
import MusicList from 'common/music-list/MusicList'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { creatSong, isValidMusic, processSongsUrl } from '@/assets/js/song.js'
export default {
  computed: {
    ...mapGetters({
      rank: 'getRank'
    })
  },
  data() {
    return {
      songs: []
    }
  },
  created () {
    this.getRankDetail()
  },
  methods: {
    getRankDetail () {
      getMusicList(this.rank.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this.normalize(res.songlist))
          .then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    normalize (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(creatSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  },
  watch: {
    rank (newval) {
      console.log(newval);
      
    }
  }

}
</script>

<style lang="stylus" scoped>
</style>
