<template>
  <div>
    <div v-if='!isEdit' class ='triplelist'>
      <page-header style="background-color: #EBEEF5;" title="三元组信息管理"/>
      <el-page-header v-if="isSearch" @back="goBack" />
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="4">
              <div class = 'radio-group'>
                <el-radio-group v-model="typeRadio" fill="#5f82ff" size="big">
                      <el-radio-button label="0">热点新闻</el-radio-button>
                      <el-radio-button label="1">其他节点</el-radio-button>
                    </el-radio-group>
              </div>
            </el-col> 
            <el-col :span="12" v-if="typeRadio == '0'" :offset="1" >
              <div class = 'radio-group'>
                <el-radio-group v-model="secondRadio" fill="#5f82ff" size="big">
                      <el-radio-button label="0">全部信息</el-radio-button>
                      <el-radio-button label="1">热点新闻</el-radio-button>
                      <el-radio-button label="2">特色培养</el-radio-button>
                      <el-radio-button label="3">招生信息</el-radio-button>
                      <el-radio-button label="4">党建动态</el-radio-button>
                      <el-radio-button label="5">校友专栏</el-radio-button>
                    </el-radio-group>
              </div>
            </el-col> 
            <el-col :span="8" v-if="typeRadio == '1'" :offset="1">
              <div class = 'radio-group'>
                <el-radio-group v-model="secondRadio" fill="#5f82ff" size="big">
                      <el-radio-button label="0">全部信息</el-radio-button>
                      <el-radio-button label="1">人</el-radio-button>
                      <el-radio-button label="2">物</el-radio-button>
                      <el-radio-button label="3">地点</el-radio-button>
                      <el-radio-button label="4">其他</el-radio-button>
                    </el-radio-group>
              </div>
            </el-col> 
            <el-col :span="6" :offset="1">
                <div class = 'search'>
                <el-input v-model="search" @keyup.enter.native="handleSearch" placeholder="请输入内容" style="width: 300px;text-align:center;">
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
           <br/>
          <el-table
            v-loading="loading"
            :header-cell-style="{background:'#EBEEF5'}"
            :data="tripleTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="false"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              label="源节点名称"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row.source_name}}
              </template>
            </el-table-column>
            <el-table-column
              label="源节点类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{type[scope.row.source_type]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="label"
              label="关系"
              align="center"
            />
            <el-table-column
              label="尾节点名称"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row.tail_name}}
              </template>
            </el-table-column>
            <el-table-column
              label="尾节点类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{type[scope.row.tail_type]}}</span>
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
              <el-button @click='isAdd = true'>添加</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletetriples">删除</el-button>
        </el-footer>
      </el-container>
      <el-dialog title="三元组信息" :visible.sync="isAdd ">
        <!-- 待添加节点 -->
        <el-dialog title="节点" :visible.sync="isChoose" append-to-body>
					<div class = 'search'>
					<el-input v-model="dialogSearch" @keyup.enter.native="handleDialogSearch" placeholder="请输入内容" style="width: 500px;text-align:center;">
					    <el-button
					      slot="append"
					      icon="el-icon-search"
					      class="search"
					      @click="handleDialogSearch"
					    />
					  </el-input>
					</div>
          <br/>
          <el-table
            :data="nodeTableData"
            highlight-current-row
            :border="false"
			style="border-radius: 4px"
          >
          <el-table-column
            prop="name"
            label="节点名"
            align="center"
          />
          <el-table-column
            label="是否热点"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.is_hot=='false'">否</span>
              <span v-if="scope.row.is_hot=='true'">是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="importance"
            label="重要等级"
            align="center"
          />
         <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="medium"
                :disabled="nodeTableData[scope.$index].disable"
                @click="handleChoose(scope.$index,scope.row)"
              >
                选择
              </el-button>
            </template>
          </el-table-column> -->
          </el-table>
          <div style="text-align: right;">
            <el-pagination
              layout="prev, pager, next"
              :total="total_add"
              :current-page.sync="cur_page_add"
            />
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="isChoose = false">取 消</el-button>
              <el-button type="primary" @click="isChoose=false">确 定</el-button>
          </span>
        </el-dialog>
        <el-form
          :model="tripleForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="源节点"
          >
          <el-select v-model="tripleForm.source" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          &nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="isChoose=true">选择候选节点</el-button>
          </el-form-item>
          <el-form-item
            label="关系"
          >
          <el-input
            v-model="tripleForm.relation"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="尾节点"
          >
          <el-select v-model="tripleForm.target" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          </el-form-item>
          <!-- <el-form-item size="large">
            <el-button @click="save" type="success">
              保存
            </el-button>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addtriple">添 加</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='tripleInfo'>
      <tripleEdit :triple='triple' @update="handleEditFinish" @back="backHome"></tripleEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import tripleEdit from './tripleEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    tripleEdit
  },
  data () {
    return {
      type:['','通知公告','特色培养','招生信息','党建动态','校友专栏'],
      secondRadio:"0",
      typeRadio:"0",
      loading:true,
      search:'',
      cur_page:1,
      cur_page_add:1,
      total_add:2,
      total:2,
      api:'/api/rel',
      apiGetAll:'/api/rels',
      apiNodes:'/api/nodes',
      api_search_dialog:'/api/search',
      api_search:'/api/rsearch',
      imageUrl:'',
      selectedtriples:[],
      triple:{},
      isChoose:false,
      isEdit: false,
      isAdd: false,
      tripleTableData:[],
      tripleForm:{},
      nodeTableData : [],
      options:[],
      dialogSearch:'',
      isDialogSearch:false,
      isSearch:false,
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
        this.getSearchData()()
      } else {
        this.getData()
      }
    },
    cur_page_add(newValue,oldValue) {
      if(this.isDialogSearch) {
        this.getDialogSearchData()
      } else {
        this.getNodes()
      }
    }
  },
  created () {
    let array =['1','2','3','3','2']
    array.forEach((value,index) => {
      this.tripleTableData.push({
        source_name:'www',
        source_type:value,
        tail_name:'fff',
        tail_type:value,
        label:'xxx'
      })
    })
    this.loading = false
   // this.getData()
   // this.getNodes()
  },
  methods: {
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
        this.total = response.data.count
        this.tripleTableData  = response.data.results[0].data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.tripleTableData  = []
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
    getDialogSearchData () {
      Axios.post(this.api_search_dialog+'?page='+this.cur_page_add+'&size=10',
        {
          keyword:this.dialogSearch,
        }
      ).then(response => {
        this.nodeTableData  = []
        this.total_add = response.data.count
        response.data.results[0].data.forEach((value) => {
          this.nodeTableData.push({
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
    handleDialogSearch () {
      if(this.dialogSearch == '') {
        this.getNodes()
      } else {
        this.getDialogSearchData()
        this.isDialogSearch = true
        this.cur_page_add = 1
      }
    },
    handleChoose(index,row) {
      this.options.push({
        value:this.nodeTableData[index].id,
        label:this.nodeTableData[index].name
      })
      this.nodeTableData[index].disable = true
    },
    getNodes() {
      Axios.get(this.apiNodes,{
        params:{
          size:10,
          page:this.cur_page_add
        }
      }).then(response => {
        this.nodeTableData  = []
        this.total_add = response.data.count
        response.data.results[0].data.forEach((value) => {
          this.nodeTableData.push({
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
		getData () {
      Axios.get(this.apiGetAll,{
        params:{
          size:10,
          page:this.cur_page
        }
      }).then(response => {
        this.total = response.data.count
        this.tripleTableData  = response.data.results[0].data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.nodeInfoTableData = []
      }).finally(() => { this.loading = false })
		},
    handleEditFinish (val) {
      this.isEdit = false
      // if (val) {
      //   //获取新数据
      //   this.getData()
      //   this.isEdit = false
      // }
    },
    backHome (val) {
      this.isEdit = val
      // this.getData()
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.triple = this.tripleTableData[index]
      // console.log(index,row)
    },
    addtriple() {
      // console.log(this.tripleForm)
      Axios.post(this.api, this.tripleForm)
        .then((res) => {
          if(res.data.errors.length!=0){
            alert(res.data.errors.message).then(()=>{
              this.$alert('添加失败')
            })
          } else {
            this.$alert('添加成功', '成功').then(() => {
              this.getData()
              this.isAdd = false
            })
          }
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deletetriple (triple) {
      console.log('triple', triple)
      const data = {
        source: triple.source,
        target:triple.target
      }
      return this.$axios.delete(this.api, {data:data})
    },
    deletetriples () {
      this.$confirm('是否删除选中的三元组', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedtriples.map(this.deletetriple))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedtriples = val
    },
    handleAvatarSuccess(res, file) {
      this.tripleForm.avatar = URL.createObjectURL(file.raw);
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #5F82FF;
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
