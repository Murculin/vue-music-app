<template>
  <transition name="slideTop">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'SlideTop'
}
</script>

<style lang="stylus" scoped>
  .slideTop-enter-active, .slideTop-leave-active
    transition all 0.5s
  .slideTop-leave-to
    transform translate3d(0,-300px,0)
    opacity 0
</style>
