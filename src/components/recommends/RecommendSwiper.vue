<template>
  <div class="slider-wrap">
    <swiper :options="swiperOption" ref="mySwiper" v-if="swiperList.length>0">
      <swiper-slide class="slide" v-for="item in swiperList" :key="item.imageUrl">
        <div class="imgWrap">
          <img class="swiperImg" :src="item.imageUrl" @load='imgLoad'>
        </div>
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    swiperList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperOption: {
        observer: true,
        observeParents: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      }
    }
  },
  methods: {
    imgLoad () {
      this.$emit('imgLoaded')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .slider-wrap >>> .swiper-container
    overflow visible
  .slider-wrap >>> .swiper-pagination-bullet
    width 16px
    height 16px
    border-radius 50%
    margin-left 8px !important
    margin-right 8px !important
    background rgba(255,255,255,0.8)
  .slider-wrap >>> .swiper-pagination-bullet-active
    background $themeColor
    width 30px
    border-radius 5px
  .slider-wrap
      position relative
      top 20px
      width 100%
      height 300px
      padding 11px
      box-sizing border-box
      .slide
        padding 0 11px
        box-sizing border-box
        .imgWrap
          width 100%
          .swiperImg
            width 100%
            border-radius 12px
</style>
