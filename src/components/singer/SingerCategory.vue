<template>
  <div class="singer-category">
    <h2 class="list-title">分类列表</h2>
    <div
      class="row"
      v-for="(group,index) in catList"
      :key="index"
    >
      <h3 class="title">{{ group.title }}:</h3>
      <div
        class="item"
        v-for="item in group.children"
        :class="{active: item.code === onCode}"
        :key="item.code"
        @click="selectCate(item, group)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      onCode: 1001, // 通过onCode决定选中的按钮
      catList: [
        {
          title: '男歌手',
          children: [
            { title: '华语', code: 1001 },
            { title: '欧美', code: 2001 },
            { title: '日本', code: 6001 },
            { title: '韩国', code: 7001 },
            { title: '其他', code: 4001 },
          ]
        },
        {
          title: '女歌手',
          children: [
            { title: '华语', code: 1002 },
            { title: '欧美', code: 2002 },
            { title: '日本', code: 6002 },
            { title: '韩国', code: 7002 },
            { title: '其他', code: 4002 },
          ]
        },
        {
          title: '乐队/组合',
          children: [
            { title: '华语', code: 1003 },
            { title: '欧美', code: 2003 },
            { title: '日本', code: 6003 },
            { title: '韩国', code: 7003 },
            { title: '其他', code: 4003 },
          ]
        }
      ]   
    }
  },
  methods: {
    selectCate (item, group) {
      this.onCode = item.code
      // 拼接歌手列表的标题
      const listTitle = item.title + group.title
      this.$emit('selectCate', item.code, listTitle)
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer-category
  padding-top 20px
  .list-title
    height 60px
    line-height 60px
    padding-left 20px
    font-size $font-size-s
    color $greyColor
    background $bgColor2
  .row
    display flex
    margin-bottom 20px
    padding 0 20px
    align-items center
    .title
      font-size 28px
  .item
    font-size 26px
    text-align center
    margin-left 20px
    padding 0 20px
    height 50px
    line-height 50px
    background $activeColor
    border-radius 40px
    &.active
      background $themeColor
      color $activeColor
</style>
