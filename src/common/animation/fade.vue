<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'Fade'
}
</script>

<style lang="stylus" scoped>
  .fade-enter, .fade-leave-to
    opacity 0
  .fade-enter-active, .fade-leave-active
    transition opacity 0.7s
</style>
