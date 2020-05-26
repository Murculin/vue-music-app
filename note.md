# 公用配置

## 全局引入styl变量

stylus会在important时被解析成css，需要借助webpack设置全局变量

```js
module.exports = {
  css: {
      stylus: {
        import: resolve('src/assets/styles/variable.styl')
      }
    }
  }
}
```



## rem适配

### 设置html根元素的fontsize

1. 获取视口宽度 document.documentElement.clientWidth
2. 获取html节点
3. 将html节点的fontSize设置为视口宽度的1/20
4. 当窗口大小变化window.onresize  时重新以上设置
5. 将代码important到main.js

### 通过postcss将px转化为rem

在webpack的css之下的loaderOptions设置

```js
css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem-exclude')({remUnit: 37.5, exclude: /node_modules/}), // 换算的基数
        ]
      },
      stylus: {
        import: resolve('src/assets/styles/variable.styl')
      }
    }
  },

```



### 解决1px边框问题

通过把边框加到after伪元素中

通过媒体查询获得设备的dpr 

根据dpr调整缩放比例 transform：scale实现

```css
/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}
/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
}
```
## 通过路由传递信息

this.$route里有当前路由的信息
this.$route.path 路径
this.$route.params
this.$route.query
可以获取在router.js中配置的数据

## 全局过滤器
```js
// 格式化播放次数的过滤器
Vue.filter('formatCount', (count) => {
  count = (count + '').split('')
  if (count.length > 8) {
    const i = count.length - 8
    return count.slice(0, i).join('') + '亿'
  } else if(count.length > 4) {
    const i = count.length - 4
    return count.slice(0, i).join('') + '万'
  } else {
    return count.join('')
  }
})
```
## 接口的封装
每个组件的请求函数统一放在一个js中
通过return Promise的方式返回
在组件中用async await处理
### axios使用
axios.get post delete put
params 指添加到url请求字符串中的 用于get请求
data  添加到请求体中的  用于post请求
```js
axios.get(`api/top/playlist/highquality`, {
    params: {
        before: lasttime,
        limit: limit
    }
}).then((res) => {
	resolve(res.data)
})
```
## 封装滚动（betterScroll）
- 把滚动部分装到slot中
- 给容器绑定ref
- 引入BScroll（构造函数）
- 通过props控制参数
- 在mounted中运行初始化函数 _initScroll
- this.scroll = new BScroll(this.$refs.wrapper, {...配置属性})
- this.scroll.on('name', fn) 绑定方法
- watch data的变化，若变化，延迟50ms调用this.scroll.refresh()

## 顶部navbar
三个具名插槽
左右固定宽  中间flex1
通过props控制背景颜色和字体颜色
## 底部tabbar
分为tabbar 和 tabbarItem
传入背景色 字体颜色 list等属性

tabbarItem 的 两个具名插槽分别放icon和text
props中接受path参数
this.$route.path.indexOf(this.path) > -1来判断是否为active状态
点击事件中 this.$router.push(this.path) 路由跳转

# 推荐页面

## 推荐页下拉加载
before=1503639064232&limit=6  before取上一页最后一个歌单的 updateTime 获取下一页数据

用loading属性控制不连续发送请求

# 歌手页面

分为选项组件和列表组件

## 下拉加载

通过code参数决定请求的数据

通过res.more判断是否加载完

page控制翻页

# MusicList 页面
作为展示歌曲列表的视图层

分为 头部 照片部分 和列表3个组件



## 头部颜色控制 

给其设置与大图相同背景图片

*filter* blur(20px) brightness(80%)

默认opacity为0 根据拖动情况控制opacity

opacity = 滚动距离 / （图片高 - 头部高）

## 图片控制

在mounted生命周期中拿到图片高度 头部高度等（clientHeight）

为scroll设置滚动监听

若上滑  图片一同向上位移

若下滑 图片缩放 scale   

*const* scalePrecent = (h + 2 * y) / h

## 计算
滚动距离y 上滑为+ 下滑为-
图片高度h2  标题高度h1

- 标题背景透明度 o
o = -y / h2 - h1
- 下滑时缩放比例 p
p = (h2+2y)/h2



# 搜索页面

分为顶部搜索框组件、搜索历史组件、热门搜索组件和搜索结果组件

搜索结果组件在query有值时显示

有一个子路由，可以打开歌手详情页面

## 搜索框防抖

searchBox组件： 监听value的变化 并防抖

在created生命周期中

```js
this.$watch('query', debounce((newVal) => {
	this.$emit('query', newVal)
}, 200))
```

## 搜索框自动获取焦点

把focus方法写在子组件上

页面mounted时调用

## 搜索历史组件

小按钮使用inline-block

searchHistory交给vuex管理，并存入localStorage中

点击搜索结果触发存入事件

点击button将内容传递给query

## 搜索结果组件

监听query变化 触发搜索的相应方法

使用offset控制页数 offset = （page -1）*limit

使用try catch 捕获失败，相识搜索失败对应的ui

点击歌手跳转到相应页面

点击歌曲，将歌曲插入播放列表



# 播放列表的计算

## 乱序播放
遍历数组
从0-i中取一个随机值
随机值对应的元素与当前遍历的元素互换位置
```js
// 随机取 min-max 之间的正数
function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 洗牌算法
function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i]
    let j = getRandom(0, i)
    arr[i] = arr[j]
    arr[j] = a
  }
  return arr
}
```






# 历史记录\播放列表\喜爱列表

存储到localStorage实现  使用good-storage库

## 播放历史、搜索历史等列表的插入的算法
```js
// 将值压入数组头部
// 若值已经存在则删去旧的
// 若数组长度超过最大值则从末尾删除一个
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
```