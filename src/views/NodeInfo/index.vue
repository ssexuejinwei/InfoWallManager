<template>
  <div>
    <div v-if='!isEdit' class ='nodeInfolist'>
      <page-header title="节点详情信息管理"/>
      <el-container>
        <el-main>
         <div class = 'search'>
         <el-input v-model="search.value" placeholder="请输入内容" style="width: 500px;text-align:center;">
           <el-select
             slot="prepend"
             v-model="search.key"
             placeholder="请选择"
             style="width: 120px"
           >
             <el-option
               label="节点名"
               value="name"
             />
             <el-option
               label="是否热点"
               value="is_hot"
             />
             <el-option
               label="重要程度"
               value="importance"
             />
             <el-option
               label="文字详情"
               value="word"
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
            :data="nodeInfoTableData"
            @selection-change="handleSelect"
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
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  详情
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
              <el-button @click='isAdd = true'>添加</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletenodeInfos">
                删除
              </el-button>
        </el-footer>
      </el-container>
      <el-dialog title="节点详情信息" :visible.sync="isAdd ">
        <el-form
          :model="nodeInfoForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="节点名"
          >
            <el-input
              v-model="nodeInfoForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="是否热点"
          >
            <el-radio-group v-model="nodeInfoForm.is_hot">
                <el-radio :label="'false'">否</el-radio>
                <el-radio :label="'true'">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="重要程度"
          >
            <el-radio-group v-model="nodeInfoForm.importance">
                <el-radio :label="'1'">1</el-radio>
                <el-radio :label="'2'">2</el-radio>
                <el-radio :label="'3'">3</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item
            label="详情标题"
          >
          <el-input
            v-model="nodeInfoForm.ext.title"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="详细信息"
          >
          <vue-editor v-model="nodeInfoForm.ext.content" />
          </el-form-item> -->
         <!-- <el-form-item label="上传图片">
            <el-upload
              class="avatar-uploader"
              action="#"
              ref="upload"
              list-type="picture"
              :file-list="fileList"
              :on-change="handleChange"
              :auto-upload="false"
              >
              <img v-for="value in fileList" :src="value" class="avatar"/>
               <i v-if="fileList.length==0" class="el-icon-plus"></i>
            </el-upload>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addnodeInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='nodeInfoInfo'>
      <nodeInfoEdit :nodeInfo='nodeInfo' @update="handleEditFinish" @back="backHome"></nodeInfoEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import nodeInfoEdit from './nodeInfoEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    nodeInfoEdit
  },
  data () {
    return {
      search:{
        value:'',
        key:''
      },
      cur_page:1,
      total:2,
      api:'/api/node',
      apiGetAll:'/api/nodes',
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
    cur_page(newValue,oldValue) {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleSearch () {
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
        this.getData()
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
      // this.getData()
    },
    handleEdit(index,row) {
      this.isEdit = true
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
