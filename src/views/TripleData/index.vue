<template>
  <div>
    <div v-if='!isEdit' class ='triplelist'>
      <page-header title="三元组信息管理"/>
      <el-container>
        <el-main>
          <div class = 'search'>
            <el-input
              v-model="search.value"
              placeholder="请输入内容"
              style="width: 500px;text-align:center;"
            >
            <el-select
              slot="prepend"
              v-model="search.key"
              placeholder="请选择"
              style="width: 120px"
            >
              <el-option
                label="节点"
                value="node"
              />
              <el-option
                label="关系"
                value="relation"
              />
            </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                class="search"
                @click="handleSearch"
              />
            </el-input>
          </div>
           <br/>
          <el-table
            v-loading="loading"
            :data="tripleTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="nodeL"
              label="节点"
              align="center"
            />
            <el-table-column
              prop="relation"
              label="关系"
              align="center"
            />
            <el-table-column
              prop="nodeR"
              label="节点"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <div style="text-align: right;">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page"
            />
          </div>
              <el-button @click='isAdd = true'>添加</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletetriples">
                删除
              </el-button>
        </el-footer>
      </el-container>
      <el-dialog title="三元组信息" :visible.sync="isAdd ">
        <!-- 待添加节点 -->
        <el-dialog title="节点" :visible.sync="isChoose" append-to-body>
          <el-table
            :data="nodeTableData"
            highlight-current-row
            :border="true"
          >
          <el-table-column
            type="selection"
          />
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
              <span v-if="scope.row.isHot==0">否</span>
              <span v-if="scope.row.isHot==1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否重要"
            align="center"
          >
          <template slot-scope="scope">
              <span v-if="scope.row.isVital==0">否</span>
              <span v-if="scope.row.isVital==1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="word"
            label="文字详情"
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
          </el-table-column>
          </el-table>
          <div style="text-align: right;">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page"
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
            label="节点"
          >
          <el-select v-model="tripleForm.nodeL" placeholder="请选择">
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
            label="节点"
          >
          <el-select v-model="tripleForm.nodeR" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item size="large">
            <el-button @click="save" type="success">
              保存
            </el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addtriple">确 定</el-button>
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
      loading:true,
      search:{
        value:'',
        key:''
      },
      cur_page:1,
      total:2,
      api:'/api/community/manage/service_group/',
      imageUrl:'',
      selectedtriples:[],
      triple:{},
      isChoose:false,
      isEdit: false,
      isAdd: false,
      tripleTableData:[],
      tripleForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      },
      nodeTableData : [
      	{
         id:1,
      	 name:'李黎',
         isHot:0,
         isVital:1,
         word:'-',
         pic:''
      	},
      	{
          id:2,
          name:'十佳歌手大赛',
          isHot:1,
          isVital:1,
          word:'十佳歌手大赛举办于xx年xx月，xxx出席......',
          pic:''
      	}
      ],
      options:[]
    }
  },
  watch: {
  },
  created () {
    this.tripleTableData = [
    	{
    	 nodeL:'李黎',
    	 relation:'冠军',
    	 nodeR:'第九届十佳歌手大赛'
    	},
    	{
    	  nodeL:'李黎',
    	  relation:'民族',
    	  nodeR:'汉'
    	}
    ]
    this.loading = false
    // this.getData()
  },
  methods: {
    handleChoose(index,row) {
      this.options.push({
        value:this.nodeTableData[index].name,
        label:this.nodeTableData[index].name
      })
      this.nodeTableData[index].disable = true
    },
    handleSearch () {
      // this.isLoading = true
    },
		getData () {
		  Axios.get(this.api).then(response => {
		    this.tripleTableData = response.data.data
		  }).catch(e => {
		    console.error(e)
		    this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		    this.tripleTableData = []
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
      console.log(index,row)
    },
    addtriple() {
      // console.log(this.tripleForm)
      this.isAdd = false
      this.tripleTableData.push(this.tripleForm)
      // Axios.post(this.api, qs.stringify(this.tripleForm))
      //   .then(() => {
      //     this.$alert('添加成功', '成功').then(() => {
      //       this.getData()
      //       this.isAdd = false
      //     })
      //   }).catch(e => {
      //     console.error(e)
      //     this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
      //   })
    },
    deletetriple (triple) {
      console.log('triple', triple)
      const data = {
        id: triple.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
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
