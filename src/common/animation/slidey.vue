<template>
  <transition name="slide">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'Slide'
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.5s
    transition-delay 0.8s;
  .slide-enter, .slide-leave-to
    transform translate3d(0,110%,0)
</style>
