<template>
  <div
    class="tab-bar"
    :style="{backgroundColor: backgroundColor, color: textColor}"
  >
    <tab-bar-item
      v-for="(item,index) in list"
      :key="index"
      :path="item.path"
      :activeColor="activeColor"
    >
      <template v-slot:icon>
        <i class="iconfont" :class="item.iconClass"></i>
      </template>
      <template v-slot:text>
        <div>{{ item.text }}</div>
      </template>
    </tab-bar-item>
  </div>
</template>

<script>
import TabBarItem from './TabBarItem'

export default {
  props: {
    activeColor: {
      type: String,
      default: 'red'
    },
    backgroundColor: {
      type: String,
      default: '#f6f6f6'
    },
    textColor: {
      type: String,
      default: '#FFFFFF'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TabBarItem
  }
}
</script>

<style lang="stylus" scoped>
.tab-bar
  display flex
  position fixed
  left 0
  right 0
  bottom 0
  box-shadow 0 -2px 2px rgba(100,100,100,.3)
</style>
