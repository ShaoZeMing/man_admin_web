<template>
  <div id="user-list" class="app-container">
    <!--添加城市按钮-->
    <div
      class="el-row"
      style="padding-bottom: 20px"
    >
      <span
        style="margin-right: 20px"
      >城市：{{city_name}}</span>
      <el-button
        type="success"
        @click="goAddGrade"
        plain
      >
        新增年级
      </el-button>
    </div>

    <!--table-->
    <el-table
      v-loading="gradeTableLoading"
      :data="gradeList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="grade_name"
        label="年级"
        width="100"
      />
      <el-table-column
        prop="weixin_account"
        label="微信号"
        width="200"
      />
      <el-table-column
        label="二维码">
        <template slot-scope="scope">
          <img :src="scope.row.weixin_image" :hidden="scope.row.weixin_image === ''" width="40" height="40" class="head_pic"/>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="goConfigWeixin(scope.row)"
          >
            配置微信和二维码
          </el-button>

          <el-button
            type="danger"
            size="mini"
            plain
            @click="goDeleteGrade(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增年级-->
    <el-dialog :visible.sync="dialogAddGradeVisible" title="新增年级">
      <el-form>

        <el-form-item>
          <el-select v-model="selected.grade_id" placeholder="请选择年级">
            <el-option v-for="grade in confGradeList " :value="grade.id" :label="grade.name"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitConfGrade(selected)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--删除年级-->
    <el-dialog :visible.sync="dialogDeleteGradeVisible" title="删除年级">
      <el-form ref="deleteCityForm" :model="deleteGradeForm" label-width="100px">

        <el-form-item>
          <span>是否删除年级？</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDelelteGrade(deleteGradeForm)">
            确认删除
          </el-button>
          <el-button type="primary" @click="closeDeleteDialog()">
            暂不删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--配置微信和二维码-->
    <el-dialog :visible.sync="dialogWeixinConfigVisible" title="配置微信和二维码">
      <el-form ref="configWeixinForm" :model="configWeixinForm" label-width="130px">

        <el-form-item label="微信号：" prop="name">
          <el-input v-model="configWeixinForm.weixin_account" placeholder="请输入微信号码" clearable/>
        </el-form-item>
        <el-form-item label="上传二维码图片：">
          <upload-oss
            :after-upload="setOssUrl"
            :image-url="configWeixinForm.weixin_image"
          ></upload-oss>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitConfigWeixin(configWeixinForm)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  getConfigGrades,
  gradeList,
  addExpansionByCity,
  delExpansion,
  confWeixin
} from '@/api/gradeExpansion'

import UploadOss from '@/components/UploadOss'

export default {
  name: 'Grade',
  components: {
    UploadOss
  },
  data () {
    return {
      city_name: null,
      city_id: null,
      gradeTableLoading: false,
      gradeList: [],
      cityParam: {
        city_id: null
      },
      dialogAddGradeVisible: false,
      dialogDeleteGradeVisible: false,
      dialogWeixinConfigVisible: false,
      confGradeList: null,
      selected: {
        grade_id: null,
        grade_name: null,
        city_id: null
      },
      deleteGradeForm: {
        grade_expansion_id: null
      },
      configWeixinForm: {
        grade_expansion_id: null,
        weixin_account: '',
        weixin_image: ''
      }

    }
  },
  created () {
    console.log('到这里了')
    console.log(this.$route.query)
    this.city_name = this.$route.query.city_name
    this.city_id = this.$route.query.city_id
    console.log(this.city_id)
    // const params=
    // params['city_id']=this.city_id
    // console.log(params)

    this.cityParam.city_id = this.city_id
    this.getGradeList(this.cityParam)
  },
  methods: {
    goAddGrade () {
      this.dialogAddGradeVisible = true
      this.getSelectGradeList(this.cityParam)
    },
    getGradeList (param) {
      this.gradeTableLoading = true
      gradeList(param).then(res => {
        this.gradeTableLoading = false
        if (res.status_code === 200) {
          this.gradeList = res.data
          this.gradeTableLoading = false
        }
      })
    },
    goDeleteGrade (expansion_id) {
      this.deleteGradeForm.grade_expansion_id = expansion_id
      this.dialogDeleteGradeVisible = true
    },
    goConfigWeixin (row) {
      this.configWeixinForm.grade_expansion_id = row.id
      this.configWeixinForm.weixin_account = row.weixin_account
      this.configWeixinForm.weixin_image = row.weixin_image
      this.dialogWeixinConfigVisible = true
    },

    submitConfigWeixin (param) {
      confWeixin(param).then(res => {
        if (res.status_code === 200) {
          this.dialogWeixinConfigVisible = false
          this.getGradeList(this.cityParam)
          this.$message.success('配置成功')
        } else {
          this.$message.error('配置失败')
          return false
        }
      })
    },
    getSelectGradeList (city_id) {
      getConfigGrades(city_id).then(res => {
        if (res.status_code === 200) {
          this.confGradeList = null
          this.confGradeList = res.data
        }
      })
    },
    submitConfGrade (selected) {
      let grade_name = ''
      for (const item of this.confGradeList) {
        console.log(item)
        if (item['id'] === selected.grade_id) {
          grade_name = item['name']
          break
        }
      }
      selected.grade_name = grade_name
      selected.city_id = this.city_id

      addExpansionByCity(selected).then(res => {
        if (res.status_code === 200) {
          this.getGradeList(this.cityParam)
          this.dialogAddGradeVisible = false
          this.selected = {}
          this.$message.success('增加年级成功')
        } else {
          this.$message.error('增加年级失败')
          return false
        }
      })
    },

    closeDeleteDialog () {
      this.dialogDeleteGradeVisible = false
    },
    submitDelelteGrade (param) {
      delExpansion(param).then(res => {
        if (res.status_code === 200) {
          this.dialogDeleteGradeVisible = false
          this.getGradeList(this.cityParam)
          this.$message.success('删除成功')
        } else {
          return false
        }
      })
    },
    // 图片
    setOssUrl (res) {
      if (res.res.status === 200) {
        this.configWeixinForm.weixin_image = ''
        this.configWeixinForm.weixin_image = res.url
      } else {
        this.$message.error('图片上传失败')
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>
