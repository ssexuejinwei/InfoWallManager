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
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletetriples">
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="三元组信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="tripleForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="节点"
          >
            <el-input
              v-model="tripleForm.nodeL"
              autocomplete="off"
            />
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
          <el-input
            v-model="tripleForm.nodeR"
            autocomplete="off"
          />
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
      search:{
        value:'',
        key:''
      },
      api:'/api/community/manage/service_group/',
      imageUrl:'',
      selectedtriples:[],
      triple:{},
      isEdit: false,
      isAdd: false,
      tripleTableData:[],
      tripleForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      }
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
    // this.getData()
  },
  methods: {
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
