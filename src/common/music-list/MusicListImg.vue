<template>
  <div class="music-list-img">
    <div class="bg-image" :style="backgroudImg"></div>
  </div>
</template>

<script>
export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    }
  },
  computed: {
    backgroudImg () {
      return `background-image: url(${this.bgImage})`
    }
  }
}
</script>

<style lang="stylus" scoped>
.music-list-img
  .bg-image
    width 100%
    height 530px
    background-repeat norepeat
    background-size cover
</style>
