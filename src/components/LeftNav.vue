<template>
  <div id="xoMenu" :style="{height:getBodyHeight+'px'}">
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" :width="300">

      <!--后期加上-->
      <el-submenu v-for="(value,index1) in leftList" :index=index1.toString() :key="index1">
        <template slot="title">{{value.name}}</template>
        <router-link v-for="(item,index2) in value.children" :key="item.route" :to=item.route><el-menu-item :index=formatNum(index1,index2) :key="index2">{{item.name}}</el-menu-item></router-link>
      </el-submenu>
    </el-menu>

      <tree :data='leftData' :count=0></tree>

  </div>
</template>
<script>
  import tree from './utility/tree'
  import Hub from './utility/commun'
  import { mapActions,mapGetters } from 'vuex';
  import {getArr} from './utility/communApi'
  export default {
    props: {

    },
    components: {
      tree,
    },
    data() {
      return {
        leftList: [

         {
            name: '统计报表',
            children: [
              {
                name: '结算记录',
                route: '/report/settlementRecord'
              },
              {
                name: '差异账单查询',
                route: '/report/billQuery'
              }
            ]
          },


          {
            name: '菜品管理',
            children: [
              {
                name: '菜品列表',
                route: '/dishesManagement/dishesManageList'
              },
              {
                name: '菜品品类',
                route: '/dishesManagement/dishesCategory'
              },
              // {
              //   name: '菜品组',
              //   route: '/dishesManagement/dishesGroup'
              // },
              {
                name: '菜品规格',
                route: '/dishesManagement/dishesSpec'
              },
              // {
              //   name: '菜品属性',
              //   route: '/dishesManagement/dishesAttr'
              // },
              {
                name: '餐盒设置',
                route: '/dishesManagement/boxSetting'
              },
              // {
              //   name: '套餐管理',
              //   route: '/dishesManagement/mealManage'
              // },
            ]
          },
        ],
        leftData:[]
      }
    },
    computed: {
      ...mapGetters([
        'getTopHeight','getBodyHeight'
      ]),
    },
    methods: {
      ...mapActions(['setTreeArr','setBodyHeight']),
      ...mapGetters(['getTreeArr']),
      recur(data,path) {
        data.forEach((map) => {
          if (map.children) {
            // this.$set(map, "show", false);
            if(map.router === path){
              this.setTreeArr({obj:getArr(map.arr)});
              this.$set(map, "selected", true);
            }else {
              this.$set(map, "selected", false);
            }
            this.recur(map.children,path)
          }
        })
      },

      recurFirst(data) {
        data.forEach((map) => {
          if (map.children) {
            this.$set(map, "show", false);
            this.recurFirst(map.children)
          }
        })
      },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      formatNum(num1,num2){
        var str1 = num1.toString();
        var str2 = num2.toString();
        return str1 + '-' + str2;
      }
    },
    created(){
      let token = this.$localStorage.get('token');
      this.$http.get(`index.php?controller=user&action=getMenu&token=${token}`).then((res) => {
        if (res.data.errcode === 0) {
          this.leftData = res.data.data;
          this.recurFirst(res.data.data);
          this.recur(this.leftData,this.$route.path)
        }
      });

    },
    mounted(){
      let bodyHeight = window.innerHeight - this.getTopHeight;
      this.setBodyHeight(bodyHeight);
      Hub.$on('mountedOk', (e) => {
        this.recur(this.leftData,this.$route.path)
      });

    },
    updated(){

    },

    destroyed(){
      Hub.$off("mountedOk");
    },

  }
</script>
<style>
  #xoMenu{
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #2A3642;
  }
</style>
