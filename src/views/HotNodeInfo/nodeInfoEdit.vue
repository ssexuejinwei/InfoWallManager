<template>
  <div class="nodeInfoEditInfo">
    <page-header style="background-color: #EBEEF5;" title="热点新闻节点" />
    <!-- <el-divider direction="" /> -->
    <el-container>
        <el-main>
          <el-form
            :model="nodeInfo"
            label-width="140px"
            style="border-radius: 4px; background-color: #FFFFFF; padding: 20px;"
          >
            <page-header title="修改热点新闻节点" />
            <el-form-item
              label="热点新闻节点名称"
            >
              <el-input
                v-model="nodeInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="热点新闻时间"
            >
              <el-date-picker
                    v-model="nodeInfo.time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            <el-form-item
              label="热点新闻类型"
            >
              <el-select v-model="nodeInfo.type" placeholder="请选择">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
              label="详细信息标题"
            >
            <el-input
              v-model="nodeInfo.title"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="详细信息提供者"
            >
            <el-input
              v-model="nodeInfo.infoProvider"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="详细信息"
            >
            <span style="color: red;font-weight: bold;">注意事项：1. 图片必须从工具栏插入
2. 不超过2000字
3. 不超过5张图片</span>
            <vue-editor id="editor"
            class="ql-editor"
                  :editorOptions="editorSettings"
                  useCustomImageHandler
                  @image-added="handleImageAdded" v-model="nodeInfo.infoContent"
                  >
                </vue-editor>
            <!-- <vue-editor id="editor" useCustomImageHandler @imageAdded="handleImageAdded" :editor-toolbar="customToolbar" v-model="content"/> -->
            <!-- <vue-editor v-model="nodeInfo.ext.content" :editor-toolbar="customToolbar"/> -->
<!--            <el-input
              v-model="nodeInfo.ext.content"
              autocomplete="off"
            /> -->
            </el-form-item>
            <el-form-item label="上传图片">
              <el-upload
                action="#"
                ref="upload"
                list-type="picture-card"
                :file-list="fileList"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :auto-upload="false"
                >
                 <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer>
          <div style="border-radius: 4px; background-color: #FFFFFF; padding: 20px;">
          <page-header title="添加热点新闻节点关系" />
          <el-form  label-width="140px">
          <div v-for="(relation,index) in relationList">
              <el-form-item :label="'关系'+String(index+1)" >
                <el-input :value="relation.s_name + '——'+ relation.relation + '——' + relation.t_name" disabled>
                    <el-button
                      slot="prepend"
                      icon="el-icon-close"
                      style="background-color: #C4C4C4;"
                      @click="handleDelRel(index)"
                    />
                </el-input>
              </el-form-item>
            </div> 
          </el-form>
          <div class="realtion" v-if="addRclick">
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
                  label="尾节点"
                >
                <el-input v-model="nodeRelationForm.name">
                &nbsp;&nbsp;&nbsp;
                  <el-button slot='append' type="primary" @click="() =>{isChoose=true;getNodes()}" style="color:#ffffff;background-color: #5f82ff">选择候选节点</el-button>
                </el-input>
                </el-form-item>
              </el-form>
          </div>
          <el-row>
            <el-col :span="2" :offset="2">
              <el-button  @click="addRclick=true" v-show="!addRclick" :disabled="addRclick">添加关系</el-button>
              <el-button  @click="addRelation" v-show="addRclick">确定</el-button>
            </el-col>
          </el-row>
          </div>
          <div style="padding: 20px;"></div>
          <el-row>
            <el-col :span="6" :offset="20">
              <el-button @click="goBack" style="background-color: #FFFFFF">
                返回
                </el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="save" style="background-color: #5f82ff" type="primary">
                保存
              </el-button>
            </el-col>
          </el-row>
          <div style="padding: 20px;"></div>
        </el-footer>
          
        <el-dialog
          title="候选节点"
          :visible.sync="isChoose "
        >
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
                <el-radio label="1">科创动态</el-radio>
                <el-radio label="2">文件通知</el-radio>
                <el-radio label="3">AI课堂</el-radio>
                <el-radio label="4">成长记录</el-radio>
                <el-radio label="5">社团空间</el-radio>
                <el-radio label="6">技术交流</el-radio>
                <el-radio label="7">lab建设</el-radio>
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
              :current-page.sync="cur_page"
            />
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" style="background-color: #5f82ff" @click="isChoose = false">取 消</el-button>
              <el-button type="primary" style="background-color: #5f82ff" @click="isChoose=false">确 定</el-button>
          </span>
        </el-dialog>
    </el-container>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
import VDistpicker from 'v-distpicker'
import { VueEditor } from "vue2-editor"
export default {
  components: {    VueEditor,    VDistpicker  },  props: {    nodeInfo: {      type: Object,      default: () => {}    }  },
  data () {
    return {
      editorSettings: {
      	modules: {
      		imageDrop: true,
      		imageResize: {}
      	}
      },
      addRclick:false,
      relationList:[],
      ishotRadio:'0',
      hotRadio:'1',
      notHotRadio:'1',
      cur_page:1,
      total:2,
      options:[],
      type:['','科创动态','文件通知','AI课堂','成长记录','社团空间','技术交流','lab建设'],
      type0:['','科创动态','文件通知','AI课堂','成长记录','社团空间','技术交流','lab建设'],
      type1:['','人','物','地点','其他'],
      nodeRelationForm:{},
      nodeInfoTableData:[],
      isChoose: false,
      typeOptions: [{
        value: '1',
        label: '科创动态'
      }, {
        value: '2',
        label: '文件通知'
      }, {
        value: '3',
        label: 'AI课堂'
      }, {
        value: '4',
        label: '成长记录'
      }, {
        value: '5',
        label: '社团空间'
      },{
        value: '6',
        label: '技术交流'
      },{
        value: '7',
        label: 'lab建设'
      }],
      api_getNodes:'/sys/data/nodePageList',
      api:'/sys/data/addOrUpdateNode',
      api_upload:'/sys/data/uploadFile',
      api_upload_get:'/sys/data/uploadFile',
      api_add_relation:'​/sys/data/addRelation',
      api_get_rel:'/sys/data/getNodeRelationByNodeId',
      api_del_rel:'/sys/data/deleteRelationById',
      defaultnodeInfo:{},
      fileList:[],
      images:[],
      is_upload:false,
      fileNames:[],
      content:"",
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"]
      ],
      maxsize:10000,
      loading:true,
      existRelNum:0
    }
  },
  watch: {
    ishotRadio(newValue, oldValue) {
      this.getNodes()
    },
    hotRadio(newValue, oldValue) {
      this.getNodes()
    },
    notHotRadio(newValue, oldValue) {
      this.getNodes()
    },
    cur_page(newValue, oldValue) {
      this.getNodes()
    },
    isChoose(newValue, oldValue) {
      this.hotRadio = '0'
      this.ishotRadio = '0'
      this.notHotRadio = '0'
    }
  },
  created () {
		// if(typeof(this.nodeInfo.ext)=='string') {
		// 	this.nodeInfo.ext = JSON.parse(this.nodeInfo.ext.replace(/'/g, '"'))
		// }
    this.nodeInfo.type = this.nodeInfo.type.toString()
    this.fileNames = this.nodeInfo.images
    this.fileNames.forEach((value,index) => {
      this.fileList.push({
        id: value,
        url: value.indexOf('http')!=-1? value:this.$baseURL+value,
      })
    })
    let Base64 = require('js-base64').Base64
    this.nodeInfo.infoContent = Base64.decode(this.nodeInfo.infoContent)
    this.getRels()
    // this.getNodes()
  },
  methods: {
    handleDelRel (index) {
      const array = []
      array.push(this.relationList[index].rel_id)
      this.$axios.post(this.api_del_rel, array).then(res =>{
        if(res.data.errorCode == 0) {
          this.$alert('删除成功')
          this.relationList.splice(index, 1)
        } else {
          this.$alert('删除失败')
        }
      })
    },
    getRels() {
      Axios.get(this.api_get_rel,{
        params:{ 
          id: this.nodeInfo.id
        }
      }).then(res => {
        let data = res.data.result
        if( res.data.errorCode == 0){
          this.existRelNum = data.length
          data.forEach((rel) => {
            this.relationList.push({
              rel_id :rel.id,
              relation:rel.relation,
              id:rel.target.id,
              t_name:rel.target.name,
              s_name:rel.source.name
            })
          })
        } else {
          this.$alert(res2.data.errorMessage,'获取节点关系失败', )
        }
       
      })
    },
    getNodes () {
      // console.log(this.$axios.default.baseURL+this.api)
      let params = 
      {
        "size": 10,
        "current": this.cur_page,
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
    addRelation() {
      this.addRclick = false
      let params = []
      params.push({
       source:this.nodeInfo.id,
       target:this.nodeRelationForm.id,
       relation:this.nodeRelationForm.relation,
      })
      Axios.post('/sys/data/addRelation',params).then(res2 => {
        if(res2.data.errorCode ==="0") {
          if(res2.data.result.length==0){
            this.$alert('保存关系失败', '已存在该关系')
          } else {
            this.$alert('保存成功', '成功').then(() => {
              this.relationList.push({
                rel_id :res2.data.result[0].id,
                relation:res2.data.result[0].relation,
                id:res2.data.result[0].target.id,
                t_name:res2.data.result[0].target.name,
                s_name:res2.data.result[0].source.name
              })
            })
          }
        } else {
          this.$alert(res2.data.errorMessage,'保存失败', )
        }
      })
      
    },
    handleChoose(index,row) {
      // console.log(this.nodeInfoTableData[index].id)
      this.nodeRelationForm = {
        ...this.nodeRelationForm,
        id:this.nodeInfoTableData[index].id,
        name:this.nodeInfoTableData[index].name
      }
      this.isChoose = false
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // console.log('i am here')
      var formData = new FormData();
      formData.append("file", file);
      Axios.post(this.api_upload,formData).then(res =>{
        // console.log(this.$baseURL + res.data.result.url)
        let url = this.$baseURL + res.data.result.url; // Get url from response
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
      }).catch(err => {
          // console.log(err);
        });
    },
    handleChange(file, fileList) {
      this.is_upload = true
      let formData = new FormData()
      formData.append('file',file.raw)
      Axios.post(this.api_upload,formData).then(res =>{
        this.fileNames.push(res.data.result.url)
      })
    },
    handleRemove(file, fileList) {
      if(file.hasOwnProperty('id')) {
        this.fileNames.forEach((value,index) => {
          if(value == file.id) {
            this.fileNames.splice(index,1)
          }
        })
      }
    },
    save () {
      // this.$emit('back', false)
      //调API
      let Base64 = require('js-base64').Base64
      let ori_content = this.nodeInfo.infoContent
      this.nodeInfo.images = this.fileNames
      this.nodeInfo.infoContent = Base64.encode(this.nodeInfo.infoContent)
      // console.log(this.nodeInfo.ext.content.length)
      if(this.nodeInfo.infoContent.length > this.maxsize) {
        this.$alert('输入内容有误，请重新输入')
        this.nodeInfo.infoContent = Base64.decode(this.nodeInfo.infoContent)
        return
      }
      // console.log(this.nodeInfo)
      // console.log(this.nodeInfo.ext.content)
      Axios.post(this.api,this.nodeInfo)
        .then((res) => {
          if(res.data.errorCode ==="0") {
            this.nodeInfo.infoContent = ori_content
            this.$alert('保存成功', '成功').then(() => {
              this.$emit('update', true)
            })
          } else {
            this.$alert(res.data.errorMessage,'保存失败', )
          }
        }).catch(e => {
          this.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    goBack() {
      if(this.is_upload) {
        this.save()
      }
      this.$emit('back', 0)
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
  }
</style>
