<template>
  <div class="tripleEditInfo">
    <page-header style="background-color: #EBEEF5;" title="三元组详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            :model="triple"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="源节点"
            >
            <el-select v-model="triple.source" placeholder="请选择">
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
              v-model="triple.label"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="尾节点"
            >
            <el-select v-model="triple.target" placeholder="请选择">
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
            <el-form-item size="large">
              <el-button @click="save" type="success">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
    </el-container>
    <el-dialog
      title="节点"
      :visible.sync="isChoose "
    >
      <el-table
        :data="nodeTableData"
        highlight-current-row
        :border="true"
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
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    VDistpicker
  },
  props: {
    triple: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
			cur_page:1,
      isChoose:false,
      api:'/api/rel',
      apiNodes:'/api/nodes',
      defaulttriple:{},
      options:[],
      nodeTableData : [],
      total:1
    }
  },
  watch: {
    cur_page(newValue,oldValue) {
      this.getNodes()
    }
  },
  created () {
    this.getNodes()
  },
  methods: {
    getNodes() {
      Axios.get(this.apiNodes,{
        params:{
          size:10,
          page:this.cur_page
        }
      }).then(response => {
        this.nodeTableData  = []
        this.total = response.data.count
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
    handleChoose(index,row) {
      this.options.push({
        value:this.nodeTableData[index].id,
        label:this.nodeTableData[index].name
      })
      this.nodeTableData[index].disable = true
    },
    save () {
      this.$emit('back', false)
      //调API
      Axios.put(this.api, this.triple)
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    goBack() {
      this.$emit('back', false)
    }
  }
}
</script>

<style lang="scss">
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
