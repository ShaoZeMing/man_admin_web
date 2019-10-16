<template>
  <div id="user-list"
       class="app-container">
    <!--添加课程按钮-->
    <div class="el-row"
         style="padding-bottom: 20px">
      <el-button type="success"
                 plain
                 @click="goAddActivity(true)">
        添加课程
      </el-button>
    </div>

    <!--搜索表单-->

    <!--table-->
    <el-table v-loading="activityListTableLoading"
              :data="activityList"
              border
              style="width: 100%">
      <el-table-column prop="id"
                       label="#ID"
                       width="100" />
      <el-table-column prop="name"
                       label="课程名称"
                       width="200" />
      <el-table-column prop="start_date"
                       label="开始日期"
                       width="200" />
      <el-table-column prop="end_date"
                       label="结束日期"
                       width="200" />
      <el-table-column prop="time"
                       label="时间段"
                       width="200" />
      <el-table-column prop="teacher_name"
                       label="老师姓名"
                       width="200" />
      <el-table-column label="老师头像"
                       style="width:150px">
        <template slot-scope="scope">
          <img :src="scope.row.teacher_image"
               width="40"
               height="40"
               class="head_pic">
        </template>

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger"
                     size="mini"
                     plain
                     @click="goDeleteCity(scope.row.id)">
            删除
          </el-button>
          <el-button type="default"
                     icon="el-icon-edit"
                     size="mini"
                     @click="copyUrl(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block"
         style="margin-top: 20px">
      <el-pagination :current-page="parseInt(activityListPage.current_page)"
                     :page-size="parseInt(activityListPage.per_page)"
                     :total="parseInt(activityListPage.total)"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>

    <!--新增课程-->
    <el-dialog :visible.sync="dialogCreateActivityVisible"
               title="新增课程">
      <el-form ref="form"
               :model="form"
               label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade_id"
                     :label="form.grade_name"
                     placeholder="请选择年级">
            <el-option v-for="grade in grade_list "
                       :key="grade"
                       :value="grade.id"
                       :label="grade.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程开始日期">
          <el-date-picker v-model="form.full_date"
                          type="daterange"
                          default-value="[2019-12-24,2019-12-25]"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程时间段">
          <el-time-picker v-model="form.time"
                          type="date"
                          format="HH:mm"
                          is-range
                          align="center"
                          range-separator="一"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item label="老师姓名">
          <el-input v-model="form.teacher_name" />
        </el-form-item>
        <el-form-item label="老师头像">
          <upload-oss :after-upload="setOssUrl"
                      :image-url="form.teacher_image" />
        </el-form-item>
        <el-form-item label="course_id">
          <el-input v-model="form.course_id" />
        </el-form-item>
        <el-form-item label="course_live_id">
          <el-input v-model="form.course_live_id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--配置图片-->
    <el-dialog :visible.sync="dialogConfCityImageVisible"
               title="配置图片">
      <el-form :model="ActivityImageForm"
               label-width="100px">
        <el-form-item label="上传图片">
          <upload-oss :after-upload="setOssUrl" />
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--删除课程-->
    <el-dialog :visible.sync="dialogDeleteCityVisible"
               title="删除课程">
      <el-form ref="deleteCityForm"
               :model="deleteCityForm"
               label-width="100px">

        <el-form-item>
          <span>是否删除课程？</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="delelteCity(deleteCityForm)">
            确认删除
          </el-button>
          <el-button type="primary"
                     @click="closeDeleteDialog()">
            暂不删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

import {
  courseList,
  courseAddOrEdit,
  courseDelete,
  gradeList
} from '@/api/activity'

import UploadOss from '@/components/UploadOss'
export default {
  name: 'Course',
  components: {
    UploadOss
  },
  data () {
    return {
      form: {
        id: '',
        name: '',
        grade_id: '',
        teacher_image: '',
        teacher_name: '',
        start_date: '',
        full_date: '',
        end_date: '',
        time: '',
        course_id: '',
        course_live_id: ''
      },
      activityListTableLoading: false,
      activityList: [],
      // city_name: null,
      // grade: null,
      activityListPage: {
        current_page: 1,
        total: 0,
        per_page: 10
      },
      dialogCreateActivityVisible: false,
      dialogConfCityImageVisible: false,
      dialogDeleteCityVisible: false,
      cityNameRules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { max: 24, message: '长度<24位', trigger: 'blur' }
        ]
      },
      deleteCityForm: {
        id: null
      },
      grade_list: '',
      ActivityImageForm: {
        image: ''
      }
    }
  },
  created () {
    const params = []
    this.getActivityList(params)
  },

  methods: {
    // 用户列表 每页多少条
    handleSizeChange (val) {
      this.activityListPage.per_page = val
      // 获取数据
      const params = {}
      params['page'] = this.activityListPage.current_page
      params['per_page'] = this.activityListPage.per_page
      this.getActivityList(params)
    },

    // 用户列表 当前第几页
    handleCurrentChange (val) {
      this.activityListPage.current_page = val
      // 获取下一页数据
      const params = {}
      params['page'] = this.activityListPage.current_page
      params['per_page'] = this.activityListPage.per_page
      console.log(params)
      this.getActivityList(params)
    },

    goAddActivity (isAdd = false) {
      this.dialogCreateActivityVisible = true
      if (isAdd === true) {
        this.resetForm()
      }
      this.gradeList()
    },
    goDeleteCity (id) {
      this.dialogDeleteCityVisible = true
      this.deleteCityForm.id = id
    },
    copyUrl (data) {
      const datas = {
        id: data.id,
        name: data.name,
        grade_id: data.grade_id,
        teacher_image: data.teacher_image,
        teacher_name: data.teacher_name,
        start_date: new Date(data.start_date_time),
        end_date: new Date(data.end_date_time),
        // time: [data.start_time, data.end_time],
        time: [new Date(data.start_time.y, data.start_time.m, data.start_time.d, data.start_time.h, data.start_time.i), new Date(data.end_time.y, data.end_time.m, data.end_time.d, data.end_time.h, data.end_time.i)],
        course_id: data.course_id,
        course_live_id: data.course_live_id
      }
      console.log(datas.time)
      this.form = datas

      console.log(this.form)
      this.goAddActivity()
    },
    goConfigGrade (ActivityId) {
      console.log('配置年级')

      let city_name = ''
      for (const item of this.activityList) {
        console.log(item)
        if (item['id'] === ActivityId) {
          city_name = item['name']
          break
        }
      }
      this.$router.push({
        name: 'activity.confCourse',
        query: {
          'activity_id': ActivityId,
          'activity_name': city_name
        }
      })
    },
    getActivityList (params) {
      this.activityListTableLoading = true
      courseList(params).then(res => {
        this.activityListTableLoading = false
        if (res.status_code === 200) {
          this.activityList = res.data.data
          this.activityListPage.current_page = res.data.meta.pagination.current_page
          this.activityListPage.total = res.data.meta.pagination.total
          this.activityListPage.per_page = res.data.meta.pagination.per_page
        }
      })
    },

    createCourse ($data) {
      console.log($data)
      courseAddOrEdit($data).then(res => {
        if (res.status_code === 200) {
          this.dialogCreateActivityVisible = false
          // this.form = null
          this.getActivityList([])
        } else {
          alert('error')
          return false
        }
      })
    },

    uploadActivityImage (params) {
      courseAddOrEdit(params).then(res => {
        if (res.status_code === 200) {
          this.dialogConfCityImageVisible = false
          this.ActivityImageForm.image = null
          this.resetForm()
          this.getActivityList([])
        }
      })
    },

    delelteCity (params) {
      console.log(params)
      courseDelete(params).then(res => {
        if (res.status_code === 200) {
          this.dialogDeleteCityVisible = false
          this.deleteCityForm.id = null
          // TODO：删除过后从新获取当前page页
          this.getActivityList([])
        }
      })
    },
    closeDeleteDialog () {
      this.dialogDeleteCityVisible = false
      this.deleteCityForm.id = null
    },

    setOssUrl (res) {
      if (res.res.status === 200) {
        this.form.teacher_image = ''
        this.form.teacher_image = res.url
      } else {
        console.log('图片上传失败')
        return false
      }
    },
    onSubmit () {
      console.log(this.form);
      const data = {
        'start_date': this.form.start_date.getTime() / 1000,
        'end_date': this.form.end_date.getTime() / 1000,
        'time': this.formatDate(this.form.time[0].getTime()) + '-' + this.formatDate(this.form.time[1].getTime()),
        'name': this.form.name,
        'teacher_name': this.form.teacher_name,
        'grade_id': this.form.grade_id,
        'course_id': this.form.course_id,
        'course_live_id': this.form.course_live_id,
        'teacher_image': this.form.teacher_image,
        'id': this.form.id
      }
      this.createCourse(data)
    },
    gradeList () {
      gradeList().then(res => {
        if (res.status_code === 200) {
          this.grade_list = res.data
        } else {
          alert('error')
          return false
        }
      })
    },
    formatDate (value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return h + ':' + m
      // return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }, resetForm () {
      this.form.id = ''
      this.form.name = ''
      this.form.grade_id = ''
      this.form.teacher_image = ''
      this.form.teacher_name = ''
      this.form.start_date = ''
      this.form.end_date = ''
      this.form.time = ''
      this.form.course_id = ''
      this.form.course_live_id = ''
    }
  }

}
</script>

<style>
#user-list .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#user-list .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

#user-list .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

#user-list .avatar {
  min-width: 178px;
  max-width: 178px;
  display: block;
}
</style>
