<template>
  <div class="personalized">
    <h3 class="title">{{ title }}</h3>
    <scroll
      class="scroll-wrapper"
      :scrollX="true"
      :scrollY="false"
      :data="list"
    >
      <ul class="list">
        <scroll-row-item
          v-for="item in list"
          :key="item.id"
          :picUrl="item.picUrl"
          :text="item.name"
          :counts="item.playCount"
          @click.native="selectItem(item)"
        ></scroll-row-item>
      </ul>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'common/scroll'
import ScrollRowItem from './ScrollRowItem'

export default {
  components: {
    Scroll,
    ScrollRowItem
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '标题'
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('selectItem', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.personalized
  padding 0 0 0 20px
  margin 40px 0 0
  .title
    font-size 28px
    font-weight bold
    margin-bottom 20px
  .scroll-wrapper
    .list
      display flex
      width 1390px
</style>
