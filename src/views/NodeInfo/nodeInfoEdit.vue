<template>
  <div class="nodeInfoEditInfo">
    <page-header title="三元组详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            :model="nodeInfo"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="节点名"
            >
              <el-input
                v-model="nodeInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="是否热点"
            >
              <el-radio-group v-model="nodeInfo.is_hot">
                  <el-radio :label="'false'">否</el-radio>
                  <el-radio :label="'true'">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="重要程度"
            >
              <el-radio-group v-model="nodeInfo.importance">
                  <el-radio :label="'1'">1</el-radio>
                  <el-radio :label="'2'">2</el-radio>
                  <el-radio :label="'3'">3</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="详情标题"
            >
            <el-input
              v-model="nodeInfo.ext.title"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="详细信息"
            >
            <el-input
              v-model="nodeInfo.ext.content"
              autocomplete="off"
            />
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
            <el-form-item size="large">
              <el-button @click="save" type="success">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
    </el-container>
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
    nodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api:'/api/node',
      api_upload:'/api/photo/upload',
      api_upload_get:'/api/photo/',
      defaultnodeInfo:{},
      fileList:[],
      images:[],
      is_upload:false,
      fileNames:[]
    }
  },
  created () {
    
		if(typeof(this.nodeInfo.ext)=='string') {
      // console.log(this.nodeInfo.ext)
			this.nodeInfo.ext = JSON.parse(this.nodeInfo.ext.replace(/'/g, '"'))
		}
    
    this.fileNames = this.nodeInfo.ext.img
    
    this.fileNames.forEach((value,index) => {
      // Axios.get(this.api_upload+'/'+value).then(res =>{
        // this.fileNames.push(res.data.results)
        // this.nodeInfo.ext.img.push(res.data.results)
        // this.save()
      //   console.log(res)
      // })
      this.fileList.push({
        id: value,
        url: this.$baseURL+this.api_upload_get+value,
      })
    })
    console.log(this.fileList)
    console.log(this.fileNames)
    // this.nodeInfo.ext.img.forEach((value) =>{
    //   this.fileNames.push(value)
    // })
  },
  methods: {
    handleChange(file, fileList) {
      this.is_upload = true
      let formData = new FormData()
      formData.append('photo',file.raw)
      Axios.post(this.api_upload,formData).then(res =>{
        this.fileNames.push(res.data.results)
        // this.nodeInfo.ext.img.push(res.data.results)
        // this.save()
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
      // console.log(this.images.length)
      this.nodeInfo.ext.img = this.fileNames
      Axios.put(this.api,this.nodeInfo)
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          this.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
      // if(this.images.length === 0) {
      //   Axios.put(this.api,this.nodeInfo)
      //     .then(() => {
      //       this.$alert('保存成功', '成功').then(() => {
      //         this.$emit('update', true)
      //       })
      //     }).catch(e => {
      //       this.error(e)
      //       this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
      //     })
      // } else {
      //   let reader =new FileReader();//创建读取文件的方法
      //   // var img1=event.target.files[0];
      //   let count = 0
      //   reader.readAsDataURL(this.images[count].raw);//将文件已url的形式读入页面
      //   let that=this;
      //   reader.onload=function(e){ 
      //     that.nodeInfo.ext.bin_img.push(e.target.result)
      //     count ++
      //     if (count < that.images.length) {
      //       reader.readAsDataURL(that.images[count].raw)
      //     } else {
      //       Axios.put(that.api,that.nodeInfo)
      //         .then(() => {
      //           that.$alert('保存成功', '成功').then(() => {
      //             that.$emit('update', true)
      //           })
      //         }).catch(e => {
      //           that.error(e)
      //           this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
      //         })
      //     }
      //   }
      // }
    },
    goBack() {
      if(this.is_upload) {
        this.save()
      }
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
  }
</style>
