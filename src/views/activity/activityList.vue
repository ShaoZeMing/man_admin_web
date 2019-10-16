<template>
  <div id="user-list"
       class="app-container">
    <!--添加活动按钮-->
    <div class="el-row"
         style="padding-bottom: 20px">
      <el-button type="success"
                 icon="el-icon-plus"
                 @click="goAddActivity()">

        添加活动
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
                       label="活动名称"
                       width="200" />

      <el-table-column label="活动图片"
                       style="width:150px">
        <template slot-scope="scope">
          <img :src="scope.row.image"
               width="40"
               height="40"
               class="head_pic">
        </template>

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info"
                     size="mini"
                     plain
                     @click="copyUrl(scope.row.id)">
            复制链接
          </el-button>

          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     plain
                     @click="goConfigGrade(scope.row.id)">
            配置课程
          </el-button>

          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     plain
                     @click="goConfigImage(scope.row.id)">
            配置图片
          </el-button>

          <el-button type="danger"
                     size="mini"
                     plain
                     @click="goDeleteCity(scope.row.id)">
            删除
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

    <!--新增活动-->
    <el-dialog :visible.sync="dialogCreateActivityVisible"
               title="新增活动">
      <el-form ref="cityNameForm"
               :model="cityNameForm"
               :rules="cityNameRules"
               label-width="100px">
        <el-form-item label=""
                      prop="name">
          <el-input v-model="cityNameForm.name"
                    placeholder="请输入活动名称"
                    clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="createCity(cityNameForm)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--配置图片-->
    <el-dialog :visible.sync="dialogConfCityImageVisible"
               title="配置图片">
      <el-form ref="ActivityImageForm"
               :model="ActivityImageForm"
               label-width="100px">
        <el-form-item label="上传图片">
          <upload-oss :after-upload="setOssUrl" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="uploadActivityImage(ActivityImageForm)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--删除活动-->
    <el-dialog :visible.sync="dialogDeleteCityVisible"
               title="删除活动">
      <el-form ref="deleteCityForm"
               :model="deleteCityForm"
               label-width="100px">

        <el-form-item>
          <span>是否删除活动？</span>
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
  activityList,
  activityDelete,
  activityAddOrEdit
} from '@/api/activity'

import UploadOss from '@/components/UploadOss'
export default {
  name: 'City',
  components: {
    UploadOss
  },
  data () {
    return {
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
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 24, message: '长度<24位', trigger: 'blur' }
        ]
      },
      cityNameForm: {
        name: ''
      },
      ActivityImageForm: {
        image: '',
        activity_id: null
      },
      deleteCityForm: {
        activity_id: null
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

      console.log('到达')
      console.log(params)
      this.getActivityList(params)
    },

    goAddActivity () {
      this.dialogCreateActivityVisible = true
    },

    goConfigImage (activityId) {
      this.ActivityImageForm.activity_id = activityId
      this.dialogConfCityImageVisible = true
    },

    goDeleteCity (activityId) {
      this.dialogDeleteCityVisible = true
      this.deleteCityForm.activity_id = activityId
    },
    copyUrl () {

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
      console.log(this.activityList.city_name)
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
      activityList(params).then(res => {
        this.activityListTableLoading = false
        if (res.status_code === 200) {
          this.activityList = res.data.data
          this.activityListPage.current_page = res.data.meta.pagination.current_page
          this.activityListPage.total = res.data.meta.pagination.total
          this.activityListPage.per_page = res.data.meta.pagination.per_page
        }
      })
    },

    createCity (cityName) {
      // this.$refs['createCityForm'].validate(valid => {
      //   if (valid) {
      activityAddOrEdit(cityName).then(res => {
        if (res.status_code === 200) {
          this.dialogCreateActivityVisible = false
          this.cityNameForm.name = null
          this.getActivityList([])
        } else {
          alert('error')
          return false
        }
      })
    },

    // uploadActivityImage (params) {
    //   activityAddOrEdit(params).then(res => {
    //     if (res.status_code === 200) {
    //       this.dialogConfCityImageVisible = false
    //       this.ActivityImageForm.image = null
    //       this.ActivityImageForm.activity_id = null
    //       this.getActivityList([])
    //     }
    //   })
    // },

    delelteCity (params) {
      console.log(params)
      activityDelete(params).then(res => {
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
        this.ActivityImageForm.image = ''
        this.ActivityImageForm.image = res.url
      } else {
        console.log('图片上传失败')
        return false
      }
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
