<template>
  <div class="nav-bar" :style="{color: color, background: background}">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'black'
    },
    background: {
      type: String,
      default: 'white'
    }
  }
}
</script>

<style lang="stylus" scoped>
.nav-bar
  display flex
  align-items center
  height 88px
  text-align center
  font-size 32px
  .left
    width 120px
    height 100%
    line-height 88px
  .right
    width 120px
    height 100%
  .center
    flex 1
    height 100%
    line-height 88px
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
</style>
