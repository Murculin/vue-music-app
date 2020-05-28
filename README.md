# my-music

## 项目简介

一款基于Vue全家桶的移动端音乐播放器

数据接口使用了https://github.com/Binaryify/NeteaseCloudMusicApi

完成了推荐页面、歌手页面、排行榜页面、搜索功能、个人中心及对应的详情页

完成了播放器组件所需的交互和特效

项目为单页面应用，使用vue-router实现路由，vuex管理组件通信

# 目录结构

├─api		// 请求相关的函数
├─assets	// css js等资源
│  ├─images
│  ├─js
│  └─styles
│      └─iconfont
├─common	// 公共组件
│  ├─animation
│  ├─loading
│  ├─music-list
|	......
│  └─tab-bar
├─components	// 页面及仅在特点页面使用的组件
│  ├─player
│  │  └─add-list
│  ├─rank
│  │  └─rank-detail
│ 	......
│  └─user-center
├─util			// 工具函数
└─vuex			// vuex相关

## 安装项目

```
npm install
```

### 运行项目
```
npm run serve
```

### 打包项目
```
npm run build
```

### 测试
```
npm run test
```

### lint 检查
```
npm run lint
```


