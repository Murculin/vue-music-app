<template>
  <div class="progress-circle">
    <svg class="circleSvg" :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="49" cx="50" cy="50" fill="transparent" stroke-dasharray="314"
              :stroke-dashoffset='dashOffset'/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset () {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~styles/variable.styl"
  .progress-circle
    position relative
    .circleSvg
      position absolute
      top 0
      left 0
    circle
      stroke-width: 16px
      transform-origin: center
      &.progress-background
        position absolute
        top 50%
        transform translateY(-50%)
        transform: scale(0.9)
        stroke rbga(0,0,0,0)
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke $themeColor
</style>
