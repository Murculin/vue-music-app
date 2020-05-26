<template>
  <transition name="slide">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'SlideBottom'
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.5s
  .slide-enter, .slide-leave-to
    transform translate3d(0,100%,0)
</style>
