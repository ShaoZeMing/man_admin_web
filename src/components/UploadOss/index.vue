<template>
  <el-upload action=""
             :http-request="aliUpload"
             :accept="accept"
             class="avatar-uploader"
             :headers="header"
             :on-change="onBeforeUpload"
             :show-file-list="showUploadList">
    <img v-if="imgUrl"
         :src="imgUrl"
         class="avatar">
    <i v-else
       class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import { getApiStsToken } from '@/api/user'
import OSS from 'ali-oss'
import { stringify } from 'querystring'

export default {
  name: "UploadOss",
  props: {
    showUploadList: {
      type: Boolean,
      default: false
    },
    header: {
      type: Object,
      default: () => {
        return {}
      }
    },
    imageUrl: {
      type: String,
      default: ''
    },
    beforeUpload: {
      type: Function,
      default: function (file, fileList) {
        const isLt2M = file.size / 1024 / 1024 < this.maxSize
        if (!isLt2M) {
          this.$message.error(`上传文件不能大于${this.maxSize}M`)
          return false
        }
      }
    },
    getStsToken: {
      type: Function,
      default: getApiStsToken
    },
    /** 上传成功结束后 */
    afterUpload: {
      type: Function,
      default: (resp) => {
        console.log(resp)
      }
    },
    //* *上传文件最大大小。默认10M */
    maxSize: {
      type: Number,
      default: 10
    },
    /** 接收的文件类型，默认jpge,png,jpg,svg,gif */
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
    },
    /** 只用于上传的oss */
    onlyUpload: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    imageUrl: function (value) {
      this.imgUrl = value
    }
  },
  data () {
    return {
      stsToken: null,
      file: null,
      imgUrl: this.imageUrl
    }
  },
  created () {
    this._fileName = ''
  },
  methods: {
    // ali上传
    async aliUpload (file, fileName) {
      if (!this.getStsToken) return
      if (file) {
        this.file = file
      }
      fileName && (this._fileName = fileName)

      await this.getStsToken().then(({ data }) => {
        this.stsToken = data
      })
      if (this.stsToken) {
        const {
          Credentials: {
            AccessKeySecret,
            AccessKeyId,
            // Expiration,
            SecurityToken
          },
          bucket,
          endpoint,
          StorePath,
          // EffectiveTime,
          cname
        } = this.stsToken
        const client = new OSS({
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken,
          bucket: bucket,
          endpoint: endpoint,
          cname
        })
        console.log(client)
        this.linearUpload(client, StorePath)
      }
    },
    // 图片上传
    linearUpload (client, path, index = 0) {
      const file = this.file.file
      const tempArr = this._fileName.split('.').reverse()
      const relativeUrl = `${path}${new Date().getTime()}${
        tempArr.length > 1 ? '.' + tempArr[0] : ''
        }`
      if (!file) return
      if (file instanceof window.File) {
        client
          .put(relativeUrl, file)
          .then(resp => {
            this.imgUrl = resp.url
            this.afterUpload(resp)
          })
          .catch(err => {
            this.$message.error('文件上传失败')
            console.log('文件上传失败:', err)
          })
      } else if (file instanceof window.Blob) {
        // blob转arrayBuffer
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        const afterUpload = this.afterUpload
        const $message = this.$message
        reader.onload = event => {
          // eslint-disable-next-line no-unused-vars
          const buffer = new OSS.Buffer(event.target.result)
          client
            .put(relativeUrl, file)
            .then(resp => {
              this.imgUrl = resp.url
              this.afterUpload(resp)
            })
            .catch(err => {
              $message.error('文件上传失败')
              console.log('文件上传失败:', err)
            })
        }
      }
    },
    onBeforeUpload (file, fileList) {
      if (this.beforeUpload && this.beforeUpload(file, fileList) === false) {
        return false
      }
      this.file = file
      this._fileName = file.name
      return false
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
