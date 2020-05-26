<template>
  <div
    class="tab-bar-item"
    :style="activeStyle"
    @click="handleClick"
  >
    <slot name="icon">
      <i class="iconfont iconicon-heart"></i>
    </slot>
    <slot name="text">
      <div>文本</div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  computed: {
    isActive () {
      return this.$route.path.indexOf(this.path) > -1
    },
    activeStyle () {
      return this.isActive ? { color: this.activeColor } : {}
    }
  },
  methods: {
    handleClick () {
      if (this.isActive) {
        return
      }
      this.$router.push(this.path)
    }
  }
}
</script>

<style lang="stylus" scoped>
.tab-bar-item
  flex 1
  height 98px
  text-align center
  font-size 24px
  padding-top 6px
  i
    font-size 40px
  div
    margin-top 6px
</style>
