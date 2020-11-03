<template>
  <div>
    <div v-if="displayType==0" class ='nodeInfolist'>
      <page-header  style="background-color: #EBEEF5; border: none;"  title="热点新闻节点"/>
      <el-page-header v-if="isSearch" @back="goBack" />
      <el-container>
        <el-main>
          <el-row>
           <el-col :span="12">
             <div class = 'radio-group'>
               <el-radio-group v-model="typeRadio" fill="#5f82ff">
                     <el-radio-button label="0">全部信息</el-radio-button>
                     <el-radio-button label="1">附中要闻</el-radio-button>
                     <el-radio-button label="2">招生信息</el-radio-button>
                     <el-radio-button label="3">党建动态</el-radio-button>
                     <el-radio-button label="4">综合新闻</el-radio-button>
                     <el-radio-button label="5">班团新闻</el-radio-button>
                   </el-radio-group>
             </div>
           </el-col> 
           <el-col :span="12">
               <div class = 'search'>
               <el-input v-model="search" @keyup.enter.native="handleSearch" placeholder="请输入内容" style="width: 500px;text-align:center;">
                   <el-button
                     slot="append"
                     icon="el-icon-search"
                     class="search"
                     @click="handleSearch"
                   />
                 </el-input>
               </div>
             </el-col>
         </el-row>
         <br>
          <!-- <p>热点新闻节点编辑</p> -->
          <el-table
           :header-cell-style="{background:'#EBEEF5'}"
            v-loading="loading"
            :data="nodeInfoTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="false"
            style="border-radius: 4px"
          >
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              prop="name"
              label="热点新闻节点名称"
              align="center"
            />
            <el-table-column
              prop="time"
              label="热点新闻时间"
              align="center"
            />
            <el-table-column
              label="热点新闻类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{type[scope.row.type]}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="importance"
              label="重要等级"
              align="center"
            /> -->
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  style="background-color: #5F82FF;"
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer style="text-align: right;">
          <div style="text-align: left;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page">
            </el-pagination>
          </div>
              <el-button @click='addNode'>添加</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletenodeInfos" :disabled="selectednodeInfos.length===0">删除</el-button>
        </el-footer>
      </el-container>
      
    </div>
    <div v-if="displayType==1" class ='nodeInfoInfo'>
      <nodeInfoEdit :nodeInfo='nodeInfo' @update="handleEditFinish" @back="backHome"></nodeInfoEdit>
    </div>
    <div v-if="displayType==2">
      <nodeInfoAdd  @update="handleAddFinish" @back="backHome"></nodeInfoAdd>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import nodeInfoEdit from './nodeInfoEdit'
import nodeInfoAdd from './nodeInfoAdd'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    nodeInfoEdit,
    nodeInfoAdd
  },
  data () {
    return {
      displayType:0,//0首页，1 edit，2add，
      type:['','附中要闻','招生信息','党建动态','综合新闻','班团新闻'],
      typeRadio:'0',
      isSearch:false,
      search:'',
      cur_page:1,
      total:12,
      api:'/api/node',
      apiGetAll:'/sys/data/nodePageList',
      api_search:'/api/search',
      api_del_node:'/sys/data/deleteNode',
      imageUrl:'',
      selectednodeInfos:[],
      nodeInfo:{},
      isEdit: false,
      isAdd: false,
      nodeInfoTableData:[],
      nodeInfoForm:{ext:{
        title:'',
        content:'',
        img:[]
      }},
      fileList:[],
      images:[],
      loading:true,
    }
  },
  watch: {
    search(newValue,oladValue) {
      if(newValue == '') {
        this.isSearch = false
      }
    },
    cur_page(newValue,oldValue) {
      this.getData()
    },
    typeRadio(newValue, oldValue) {
      this.getData()
    },
    displayType(newValue, oldValue) {
      if(newValue == 0){
        this.getData()
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addNode(){
      this.displayType = 2
    },
    goBack () {
      this.isSearch = false
      this.search = ''
      this.cur_page = 1
      this.getData()
    },
    handleSearch () {
      if(this.search == '') {
        this.getData()
      } else {
        this.isSearch = true
        this.cur_page = 1
        // this.getSearchData()
        this.getData()
      }
    },
    handleChange(file, fileList) {
      this.images.push(file)
    },
    handleRemove(file, fileList) {
      this.images.forEach((value,index) =>{
          if(file.uid == value.uid){
            this.images.splice(index,1)
            this.$alert('删除成功', '成功')
          } 
      })
      this.$alert('删除成功', '成功')
    },
		getData () {
      // console.log(this.$axios.default.baseURL+this.api)
      let params = 
        {
          "size": 10,
          "current": this.cur_page,
          "search": this.isSearch?this.search:'',
          "isNews": true,
          "type": this.typeRadio==0?null:this.typeRadio
        }
      Axios.post(this.apiGetAll,params).then(res => {
        // console.log(response)
        let data = res.data.result
        // console.log(data)
        this.total = data.total
        this.nodeInfoTableData = data.records
        this.displayType = 0
      }).catch(e => {
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.nodeInfoTableData = []
      }).finally(() => {this.loading = false})
		},
    handleEditFinish (val) {
      // this.isEdit = false
      if (val) {
        //获取新数据
        this.getData()
        // this.displayType = 0
      }
    },
    handleAddFinish (val) {
      if (val) {
        //获取新数据
        this.getData()
        // this.displayType = 0
      }
    },
    backHome (val) {
      this.displayType = val
    },
    handleEdit(index,row) {
      this.displayType = 1
      this.nodeInfo = this.nodeInfoTableData[index]
      // console.log(index,row)
    },
    addnodeInfo() {
      Axios.post(this.api, this.nodeInfoForm)
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deletenodeInfo (nodeInfo) {
      const array = []
      array.push(nodeInfo.id)
      return this.$axios.post(this.api_del_node, array)
    },
    deletenodeInfos () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectednodeInfos.map(this.deletenodeInfo))
          .then((res) => {
            if(res[0].data.errorCode == 0) {
              this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
                this.getData()
              }), (e) => {
                console.error(e)
                this.$alert('删除失败', '错误', { type: 'error' })
              }
            } else{
              this.$alert('删除失败', res.data.result)
            } 
          })
        })
    },
    handleSelect (val) {
      this.selectednodeInfos = val
    },
    handleAvatarSuccess(res, file) {
      this.nodeInfoForm.avatar = URL.createObjectURL(file.raw);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~vue2-editor/dist/vue2-editor.css";
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
