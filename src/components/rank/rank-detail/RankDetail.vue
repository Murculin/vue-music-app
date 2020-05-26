<template>
  <music-list
    :title="rank.name"
    :bgImage="rank.imgUrl"
    :songs="songs"
  ></music-list>
</template>

<script>
import MusicList from 'common/music-list/MusicList'
import { mapGetters } from 'vuex'
import { getRankDetail } from 'api/rank.js'
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
    this._getRankDetail()
  },
  methods: {
    async _getRankDetail () {
      this.songs = await getRankDetail(this.rank.idx)
      console.log(this.songs)
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
</style>
