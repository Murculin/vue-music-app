<template>
  <transition name="fadeIn">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'FadeIn'
}
</script>

<style lang="stylus" scoped>
  .fadeIn-enter
    opacity 0
  .fadeIn-enter-active
    transition opacity 0.7s
</style>
