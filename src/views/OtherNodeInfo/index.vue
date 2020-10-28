<template>
  <div>
    <div v-if="displayType==0" class ='nodeInfolist'>
      <page-header style="background-color: #EBEEF5;" title="其他节点"/>
      <el-page-header v-if="isSearch" @back="goBack" />
      <el-container>
        <el-main>
          <el-row>
           <el-col :span="8">
             <div class = 'radio-group'>
               <el-radio-group v-model="typeRadio" fill="#5f82ff">
                     <el-radio-button label="0">全部</el-radio-button>
                     <el-radio-button label="1">人</el-radio-button>
                     <el-radio-button label="2">物</el-radio-button>
                     <el-radio-button label="3">地点</el-radio-button>
                     <el-radio-button label="4">其他</el-radio-button>
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
              label="其他节点名称"
              align="center"
            />
            <el-table-column
              label="其他节点类型"
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
                  修改
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
              <el-button @click="deletenodeInfos">删除</el-button>
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
      type:['','人','物','地点','其他'],
      typeRadio:'0',
      isSearch:false,
      search:'',
      cur_page:1,
      total:12,
      api:'/api/node',
      apiGetAll:'/api/nodes',
      api_search:'/api/search',
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
      if(this.isSearch) {
        this.getSearchData()
      } else {
        this.getData()
      }
    }
  },
  created () {
    // this.getData()
    let array =['1','2','3','4','3']
    array.forEach((value,index) => {
      this.nodeInfoTableData.push({
        id:index,
        name:"textss",
        date:"2020/10/1",
        type:value,
      })
    })
    this.loading=false
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
    getSearchData () {
      Axios.post(this.api_search+'?page='+this.cur_page+'&size=10',
        {
          keyword:this.search,
        }
      ).then(response => {
        this.nodeInfoTableData  = []
        this.total = response.data.count
        response.data.results[0].data.forEach((value) => {
          this.nodeInfoTableData.push({
            id: value.meta[0].id,
            name:value.row[0].name,
            ext:value.row[0].ext,
            importance:value.row[0].importance,
            is_hot:value.row[0].is_hot
          })
        })
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.nodeInfoTableData = []
      }).finally(() => { this.loading = false })
    },
    handleSearch () {
      if(this.search == '') {
        this.getData()
      } else {
        this.isSearch = true
        this.cur_page = 1
        this.getSearchData()
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
      Axios.get(this.apiGetAll,{
        params:{
          size:10,
          page:this.cur_page
        }
      }).then(response => {
        this.nodeInfoTableData  = []
        this.total = response.data.count
        response.data.results[0].data.forEach((value) => {
          this.nodeInfoTableData.push({
            id: value.meta[0].id,
            name:value.row[0].name,
            ext:value.row[0].ext,
            importance:value.row[0].importance,
            is_hot:value.row[0].is_hot
          })
        })
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.nodeInfoTableData = []
      }).finally(() => { this.loading = false })
		},
    handleEditFinish (val) {
      // this.isEdit = false
      if (val) {
        //获取新数据
        if(this.isSearch) {
          this.getSearchData()
        } else {
          this.getData()
        }
        this.displayType = 0
      }
    },
    handleAddFinish (val) {
      // this.isEdit = false
      if (val) {
        //获取新数据
        if(this.isSearch) {
          this.getSearchData()
        } else {
          this.getData()
        }
        this.displayType = 0
      }
    },
    backHome (val) {
      this.displayType = val
      // this.getData()
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
      const data = {
        id: nodeInfo.id
      }
      return this.$axios.delete(this.api, {data:data})
    },
    deletenodeInfos () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectednodeInfos.map(this.deletenodeInfo))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
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
