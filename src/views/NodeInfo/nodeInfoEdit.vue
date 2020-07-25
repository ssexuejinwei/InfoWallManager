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
              <el-radio-group v-model="nodeInfo.isHot">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否重要"
            >
              <el-radio-group v-model="nodeInfo.isVital">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="文字详情"
            >
            <el-input
              v-model="nodeInfo.word"
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
      api:'/api/community/manage/service_group/',
      defaultnodeInfo:{},
      fileList:[],
      images:{}
    }
  },
  created () {
  },
  methods: {
    handleChange(file, fileList) {
      // this.images = fileList
      // console.log(this.images)
      this.images.push(file)
    },
    handleRemove(file, fileList) {
      this.$alert('删除成功', '成功')
    },
    save () {
      this.$emit('back', false)
      //调API
      // Axios.put(this.api, qs.stringify(this.nodeInfo))
      //   .then(() => {
      //     this.$alert('保存成功', '成功').then(() => {
      //       this.$emit('update', true)
      //     })
      //   }).catch(e => {
      //     console.error(e)
      //     this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
      //   })
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
