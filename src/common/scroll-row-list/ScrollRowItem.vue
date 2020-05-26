<template>
  <div class="scroll-row-item">
    <div class="img-wrapper">
      <img class="image" v-lazy="picUrl">
      <div class="tag">
        <i class="iconfont iconbofang1"></i>
        <span>{{ counts | formatCount }}</span>
      </div>
    </div>
    <h2 class="text">
      {{ formatText }}
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    picUrl: {
      type: String
    },
    text: {
      type: String,
      default: ''
    },
    counts: {
      type: Number,
      default: 0
    }
  },
  computed: {
    formatText () {
      return this.text.split('').slice(0, 14).join('')
    }
  }
}
</script>

<style lang="stylus" scoped>
.scroll-row-item
  display flex
  flex-direction column
  width 210px
  height 290px
  margin-right 20px
  .img-wrapper
    position relative
    width 100%
    height 210px
    border-radius 5PX
    .image
      width 100%
      height 100%
      border-radius 5PX
    .tag
      position absolute
      top 14px
      right 14px
      font-size 24px
      color #fff
      i
        font-size 30px
        margin-right 8px
  .text
    height 70px
    margin-top 10px
    font-size 24px
    line-height 40px
    white-space normal
    text-align center
</style>
