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

# MusicList 页面
作为展示歌曲列表的视图层
## 计算
滚动距离y 上滑为+ 下滑为-
图片高度h2  标题高度h1

- 标题背景透明度 o
o = -y / h2 - h1
- 下滑时缩放比例 p
p = (h2+2y)/h2

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