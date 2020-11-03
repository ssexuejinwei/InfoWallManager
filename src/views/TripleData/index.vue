<template>
  <div>
    <div v-if='!isEdit' class ='triplelist'>
      <page-header style="background-color: #EBEEF5;" title="三元组信息管理"/>
      <el-page-header v-if="isSearch" @back="goBack" />
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="5">
              <div class = 'radio-group'>
                <el-radio-group v-model="typeRadio" fill="#5f82ff" size="big">
                      <el-radio-button label="0">热点新闻</el-radio-button>
                      <el-radio-button label="1">其他节点</el-radio-button>
                    </el-radio-group>
              </div>
            </el-col> 
            <el-col :span="12" v-if="typeRadio == '0'" >
              <div class = 'radio-group'>
                <el-radio-group v-model="secondRadio" fill="#5f82ff" size="big">
                      <el-radio-button label="0">全部信息</el-radio-button>
                      <el-radio-button label="1">附中要闻</el-radio-button>
                      <el-radio-button label="2">招生信息</el-radio-button>
                      <el-radio-button label="3">党建动态</el-radio-button>
                      <el-radio-button label="4">综合新闻</el-radio-button>
                      <el-radio-button label="5">班团新闻</el-radio-button>
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
            <el-col :span="5" :offset="1">
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
              align="center"
            />
            <el-table-column
              label="源节点名称"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row.source.name}}
              </template>
            </el-table-column>
            <el-table-column
              label="源节点类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.source.isNews==true?type0[scope.row.source.type]:type1[scope.row.source.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="relation"
              label="关系"
              align="center"
            />
            <el-table-column
              label="尾节点名称"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row.target.name}}
              </template>
            </el-table-column>
            <el-table-column
              label="尾节点类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.target.isNews==true?type0[scope.row.target.type]:type1[scope.row.target.type]}}</span>
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
              <el-button @click="deletetriples" :disabled="this.selectedtriples.length==0">删除</el-button>
        </el-footer>
      </el-container>
      <el-dialog title="三元组信息" :visible.sync="isAdd ">
        <!-- 待添加节点 -->
        <el-dialog title="节点" :visible.sync="isChoose" append-to-body>
					<div class="filter">
					    <el-row>
					      <el-radio-group v-model="ishotRadio" fill="#5f82ff" size="small">
					        <el-radio-button label="0">热点新闻节点</el-radio-button>
					        <el-radio-button label="1">其他新闻节点</el-radio-button>
					      </el-radio-group>
					    </el-row>
					    <br>
					    <el-row v-if="ishotRadio == 1">
					      <el-radio-group v-model="notHotRadio" fill="#5f82ff">
                    <el-radio label="0">全部信息</el-radio>
					          <el-radio label="1">人</el-radio>
					          <el-radio label="2">物</el-radio>
					          <el-radio label="3">地点</el-radio>
					          <el-radio label="4">其他</el-radio>
					        </el-radio-group>
					    </el-row>
					    <el-row v-if="ishotRadio == 0">
					      <el-radio-group v-model="hotRadio" fill="#5f82ff">
                    <el-radio label="0">全部信息</el-radio>
					          <el-radio label="1">附中要闻</el-radio>
					          <el-radio label="2">招生信息</el-radio>
					          <el-radio label="3">党建动态</el-radio>
					          <el-radio label="4">综合新闻</el-radio>
					          <el-radio label="5">班团新闻</el-radio>
					        </el-radio-group>
					    </el-row>
					  </div>
					  <br>
					    <el-table
					     :header-cell-style="{background:'#D5D8DE'}"
					      v-loading="loading"
					      :data="nodeInfoTableData"
					      highlight-current-row
					      :border="false"
					style="border-radius: 4px"
					    >
					      <el-table-column
					        prop="name"
					        label="节点名称"
					        align="center"
					      />
					      <el-table-column
					        label="节点类型"
					        align="center"
					      >
					        <template slot-scope="scope">
					          <span>{{ishotRadio==0?type0[scope.row.type]:type1[scope.row.type]}}</span>
					        </template>
					      </el-table-column>
					      <el-table-column
					        label="操作"
					        align="center"
					      >
					        <template slot-scope="scope">
					          <el-button
					            type="primary"
					            style="background-color: #5F82FF;"
					            size="medium"
					            :disabled="nodeInfoTableData[scope.$index].disable"
					            @click="handleChoose(scope.$index,scope.row)"
					          >
					            选择
					          </el-button>
					        </template>
					      </el-table-column>
					    </el-table>
					    <div style="text-align: right;">
					      <el-pagination
					        layout="prev, pager, next"
					        :total="total"
					        :current-page.sync="cur_page_add"
					      />
					    </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="isChoose = false">取 消</el-button>
              <el-button type="primary" @click="isChoose=false">确 定</el-button>
          </span>
        </el-dialog>
        <el-form
        :model="nodeRelationForm"
        label-width="140px"
        >
          <el-form-item
            label="关系"
          >
          <el-input
            v-model="nodeRelationForm.relation"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="源节点"
          >
          <el-select v-model="nodeRelationForm.nodeFrom" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
					
          &nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="() =>{isChoose=true;getNodes()}" style="background-color: #5f82ff">选择候选节点</el-button>
          </el-form-item>
					<el-form-item
					  label="尾节点"
					>
					<el-select v-model="nodeRelationForm.nodeTo" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
					</el-form-item>
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
      nodeRelationForm:{},
      ishotRadio:'0',
      hotRadio:'0',
      notHotRadio:'0',
      nodeInfoTableData:[],
      type0:['','附中要闻','招生信息','党建动态','综合新闻','班团新闻'],
      type1:['','人','物','地点','其他'],
      secondRadio:"0",
      typeRadio:"0",
      loading:true,
      search:'',
      cur_page:1,
      cur_page_add:1,
      total_add:2,
      total:2,
      api:'/api/rel',
      apiGetAll:'/sys/data/getRelationList',
      api_getNodes:'/sys/data/nodePageList',
      api_add_relation:'/sys/data/addRelation',
      api_del_node:'/sys/data/deleteRelationById',
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
    typeRadio(newValue,oladValue) {
        this.secondRadio = '0'
        this.getData()
    },
    secondRadio(newValue,oladValue) {
        this.getData()
    },
    search(newValue,oladValue) {
      if(newValue == '') {
        this.isSearch = false
      }
    },
    cur_page(newValue,oldValue) {
      this.getData()
    },
    cur_page_add(newValue,oldValue) {
      this.getNodes()
    },
    ishotRadio(newValue, oldValue) {
      this.getNodes()
    },
    hotRadio(newValue, oldValue) {
      this.getNodes()
    },
    notHotRadio(newValue, oldValue) {
      this.getNodes()
    }
  },
  created () {
   this.getData()
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
        // this.getSearchData()
        this.getData()
      }
    },
    handleChoose(index,row) {
      this.options.push({
        value:this.nodeInfoTableData[index].id,
        label:this.nodeInfoTableData[index].name
      })
      this.nodeInfoTableData[index].disable = true
      this.$alert('选择成功')
    },
    getNodes () {
      // console.log(this.$axios.default.baseURL+this.api)
      this.loading = true
      let params = 
        {
          "size": 10,
          "current": this.cur_page_add,
          "search": "",
          "isNews": this.ishotRadio == '0'?true:false,
          "type": this.ishotRadio == '0'?this.hotRadio:this.notHotRadio
        }
        if(params.type == 0) {
          params.type = null
        }
      Axios.post(this.api_getNodes,params).then(res => {
        // console.log(response)
        let data = res.data.result
        this.total = data.total
        this.nodeInfoTableData = data.records
      }).catch(e => {
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.nodeInfoTableData = []
      }).finally(() => {this.loading = false})
    },
		getData () {
		  // console.log(this.$axios.default.baseURL+this.api)
		  let params = 
		    {
		      "size": 10,
		      "current": this.cur_page,
		      "search": this.isSearch?this.search:'',
		      "isNews": this.typeRadio == 0?true:false,
		      "type": this.secondRadio==0?null:this.secondRadio
		    }
		  Axios.post(this.apiGetAll,params).then(res => {
		    // console.log(response)
		    let data = res.data.result
		    // console.log(data)
		    this.total = data.total
		    this.tripleTableData = data.records
		  }).catch(e => {
		      this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		      this.nodeInfoTableData = []
		  }).finally(() => {this.loading = false})
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
      let params = []
      params.push({
        source:this.nodeRelationForm.nodeFrom,
        target:this.nodeRelationForm.nodeTo,
        relation:this.nodeRelationForm.relation
      })
      Axios.post(this.api_add_relation,params).then(res2 => {
        if(res2.data.errorCode ==="0") {
          this.$alert('添加成功', '成功').then(() => {
            this.isAdd = false
            this.getData()
          })
        } else {
          this.$alert(res2.data.errorMessage,'添加失败', )
        }
      })
    },
    deletetriple (triple) {
      const array = []
      array.push(triple.id)
      return this.$axios.post(this.api_del_node, array)
    },
    deletetriples () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedtriples.map(this.deletetriple))
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
