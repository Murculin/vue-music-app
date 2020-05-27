import Vue from 'vue'
import Router from 'vue-router'
import Rank from './components/rank/Rank'
import Recommends from './components/recommends/Recommends'
import Singer from './components/singer/Singer'
import Search from './components/search/Search'
import SingerDetail from './components/singer/singer-detail/SingerDetail'
import Disc from './components/recommends/disc/disc'
import RankDetail from './components/rank/rank-detail/RankDetail'
import UserCenter from './components/user-center/UserCenter'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommends'
    },
    {
      path: '/rank',
      name: '榜单',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/recommends',
      name: '推荐',
      component: Recommends,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: '歌手',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/center',
      name: '个人',
      component: UserCenter
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: 'singer/:id',
          component: SingerDetail
        }
      ]
    }
  ]
})
