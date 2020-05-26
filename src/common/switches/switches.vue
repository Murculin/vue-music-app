<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}" :key="index"
        @click="switchItem(index)">
      <span>{{item.name}} </span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default () {
          return []
        }
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem (index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable.styl' 
  .switches
    display flex
    align-items center
    margin 0 auto
    width 480px
    border 2px solid
    border-radius 10px
    font-size $font-size-m
    .switch-item
      flex 1
      padding 16px
      text-align center
      border-radius 10px
      &.active
        background $themeColor
        color #fff
</style>
