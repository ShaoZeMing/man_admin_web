<template>
  <div
    id="user-list"
    class="app-container"
  >
    <!--添加城市按钮-->
    <div
      class="el-row"
      style="padding-bottom: 20px"
    >
      <span style="margin-right: 20px">活动：{{ activity_name }}</span>
      <el-button
        type="success"
        plain
        @click="goAddGrade"
      >
        添加活动课程
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
        prop="name"
        label="课程名称"
        width="200"
      />
      <!--      <el-table-column-->
      <!--        prop="weixin_image"-->
      <!--        label="二维码"-->
      <!--        width="500"-->
      <!--      />-->
      <el-table-column
        prop="teacher_name"
        label="老师姓名"
        width="200"
      />
      <el-table-column label="老师头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.teacher_image"
            width="40"
            height="40"
            class="head_pic"
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="default"
            icon="el-icon-edit"
            size="mini"
            @click="goDeleteGrade(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增年级-->
    <el-dialog
      :visible.sync="dialogAddGradeVisible"
      title="新增活动课程"
    >
      <el-form>

        <el-form-item>
          <el-select v-model="selected.id" multiple placeholder="请选择">
            <el-option
              v-for="grade in confGradeList "
              :key="grade.id"
              :value="grade.id"
              :label="grade.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitConfGrade(selected)"
          >
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--删除年级-->
    <el-dialog
      :visible.sync="dialogDeleteGradeVisible"
      title="删除年级"
    >
      <el-form
        ref="deleteCityForm"
        :model="deleteGradeForm"
        label-width="100px"
      >

        <el-form-item>
          <span>是否删除年级？</span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitDelelteGrade(deleteGradeForm)"
          >
            确认删除
          </el-button>
          <el-button
            type="primary"
            @click="closeDeleteDialog()"
          >
            暂不删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--配置微信和二维码-->
    <el-dialog
      :visible.sync="dialogWeixinConfigVisible"
      title="配置微信和二维码"
    >
      <el-form
        ref="configWeixinForm"
        :model="configWeixinForm"
        label-width="100px"
      >

        <el-form-item
          label="微信号："
          prop="name"
        >
          <el-input
            v-model="configWeixinForm.weixin_account"
            placeholder="请输入微信号码"
            clearable
          />
        </el-form-item>
        <el-form-item label="上传二维码图片">
          <upload-oss :after-upload="setOssUrl" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitConfigWeixin(configWeixinForm)"
          >
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  getActivityCourse,
  deleteActivityCourse,
  getOptionActivityCourse,
  addActivityCourse
} from '@/api/activity'

import UploadOss from '@/components/UploadOss'

export default {
  name: 'Course',
  components: {
    UploadOss
  },
  data () {
    return {
      activity_name: null,
      activity_id: null,
      gradeTableLoading: false,
      gradeList: [],
      cityParam: {
        activity_id: null
      },
      dialogAddGradeVisible: false,
      dialogDeleteGradeVisible: false,
      dialogWeixinConfigVisible: false,
      confGradeList: null,
      selected: {
        course_id: null,
        grade_name: null,
        activity_id: null
      },
      deleteGradeForm: {
        activity_course_id: null
      },
      configWeixinForm: {
        activity_course_id: null,
        weixin_account: '',
        weixin_image: ''
      }

    }
  },
  created () {
    console.log('到这里了')
    console.log(this.$route.query)
    this.activity_name = this.$route.query.activity_name
    this.activity_id = this.$route.query.activity_id
    console.log(this.activity_id)
    // const params=
    // params['activity_id']=this.activity_id
    // console.log(params)

    this.cityParam.activity_id = this.activity_id
    this.getGradeList(this.cityParam)
  },
  methods: {
    goAddGrade () {
      this.dialogAddGradeVisible = true
      this.getSelectGradeList(this.cityParam)
    },
    getGradeList (param) {
      this.gradeTableLoading = true
      getActivityCourse(param).then(res => {
        this.gradeTableLoading = false
        if (res.status_code === 200) {
          this.gradeList = res.data
          this.gradeTableLoading = false
        }
      })
    },
    goDeleteGrade (expansion_id) {
      this.deleteGradeForm.activity_course_id = expansion_id
      this.dialogDeleteGradeVisible = true
    },
    getSelectGradeList (activity_id) {
      getOptionActivityCourse(activity_id).then(res => {
        if (res.status_code === 200) {
          this.confGradeList = null
          this.confGradeList = res.data
        }
      })
    },
    submitConfGrade (selected) {
      console.log(selected)
      selected.course_id = selected.id
      selected.activity_id = this.activity_id
      const data = {
        course_id: selected.id,
        activity_id: this.activity_id
      }
      addActivityCourse(data).then(res => {
        if (res.status_code === 200) {
          this.getGradeList(this.cityParam)
          this.dialogAddGradeVisible = false
          this.selected = {}
        } else {
          return false
        }
      })
    },

    closeDeleteDialog () {
      this.dialogDeleteGradeVisible = false
    },
    submitDelelteGrade (param) {
      deleteActivityCourse(param).then(res => {
        if (res.status_code === 200) {
          this.dialogDeleteGradeVisible = false
          this.getGradeList(this.cityParam)
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
        console.log('图片上传失败')
        return false
      }
    }

  }
}
</script>

<style scoped>
</style>
