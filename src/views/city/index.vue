<template>
  <div id="user-list" class="app-container">
    <!--添加城市按钮-->
    <div
      class="el-row"
      style="padding-bottom: 20px"
    >
      <el-button
        type="success"
        plain
        @click="goAddCity"
      >
        新增城市
      </el-button>
    </div>

    <!--搜索表单-->

    <!--table-->
    <el-table
      v-loading="cityListTableLoading"
      :data="cityList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="#ID"
        width="100"
      />
      <el-table-column
        prop="name"
        label="城市"
        width="200"
      />
      <el-table-column
        prop="grades"
        label="现有年级"
        width="500"
      />

      <el-table-column
      label ="城市图片"
      style="width:150px">
        <template slot-scope="scope">
          <img :src="scope.row.image" :hidden="scope.row.image === ''" width="40" height="40" class="head_pic"/>
        </template>

      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-clipboard:copy="scope.row.front_url"
            v-clipboard:success="clipboardSuccessHandler "
            v-clipboard:error="clipboardErrorHandler"
            type="info"
            size="mini"
            plain
            style="cursor: copy">
            复制链接
          </el-button>

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="goConfigGrade(scope.row)"
          >
            配置年级
          </el-button>

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="goConfigImage(scope.row)"
          >
            配置图片
          </el-button>

          <el-button
            type="danger"
            size="mini"
            plain
            @click="goDeleteCity(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block" style="margin-top: 20px">
      <el-pagination
        :current-page="parseInt(cityListPage.current_page)"
        :page-size="parseInt(cityListPage.per_page)"
        :total="parseInt(cityListPage.total)"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--新增城市-->
    <el-dialog :visible.sync="dialogCreateCityVisible" title="新增城市">
      <el-form ref="cityNameForm" :model="cityNameForm" :rules="cityNameRules" label-width="100px">
        <el-form-item label="" prop="name">
          <el-input v-model="cityNameForm.name" placeholder="请输入城市名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="createCity(cityNameForm)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--配置图片-->
    <el-dialog :visible.sync="dialogConfCityImageVisible" title="配置图片">
      <el-form ref="cityImageForm" :model="cityImageForm"  label-width="100px">
        <el-form-item label="上传图片：">
          <upload-oss
            :after-upload="setOssUrl"
            :image-url="cityImageForm.image_url"
          ></upload-oss>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="uploadCityImage(cityImageForm)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--删除城市-->
    <el-dialog :visible.sync="dialogDeleteCityVisible" title="删除城市">
      <el-form ref="deleteCityForm" :model="deleteCityForm"  label-width="100px">

        <el-form-item >
          <span>是否删除城市？</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="delelteCity(deleteCityForm)">
            确认删除
          </el-button>
          <el-button type="primary" @click="closeDeleteDialog()">
            暂不删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

import {
  cityList,
  createCity,
  uploadCityImage,
  deleteCity
} from '@/api/city'

import UploadOss from '@/components/UploadOss'
export default {
  name: 'City',
  components: {
    UploadOss
  },
  data () {
    return {
      cityListTableLoading: false,
      cityList: [],
      // city_name: null,
      // grade: null,
      cityListPage: {
        current_page: 1,
        total: 0,
        per_page: 10
      },
      dialogCreateCityVisible: false,
      dialogConfCityImageVisible: false,
      dialogDeleteCityVisible: false,
      cityNameRules: {
        name: [
          { required: true, message: '请输入城市名称', trigger: 'blur' },
          { max: 24, message: '长度<24位', trigger: 'blur' }
        ]
      },
      cityNameForm: {
        name: ''
      },
      cityImageForm: {
        image_url: '',
        city_id: null
      },
      deleteCityForm: {
        id: null
      },
      copiedUrlCityName: ''
    }
  },
  created () {
    const params = []
    this.getCityList(params)
  },

  methods: {
    // 用户列表 每页多少条
    handleSizeChange (val) {
      this.cityListPage.per_page = val
      // 获取数据
      const params = {}
      params['page'] = this.cityListPage.current_page
      params['per_page'] = this.cityListPage.per_page
      this.getCityList(params)
    },

    // 用户列表 当前第几页
    handleCurrentChange (val) {
      this.cityListPage.current_page = val
      // 获取下一页数据
      const params = {}
      params['page'] = this.cityListPage.current_page
      params['per_page'] = this.cityListPage.per_page

      console.log('到达')
      console.log(params)
      this.getCityList(params)
    },

    goAddCity () {
      this.dialogCreateCityVisible = true
    },

    goConfigImage (row) {
      console.log('配置图片城市id')
      console.log(row)
      this.cityImageForm.city_id = row.id
      this.cityImageForm.image_url = row.image
      this.dialogConfCityImageVisible = true
    },

    goDeleteCity (cityId) {
      this.dialogDeleteCityVisible = true
      this.deleteCityForm.id = cityId
    },

    goConfigGrade (row) {
      this.$router.push({
        name: 'city.confGrade',
        query: {
          'city_id': row.id,
          'city_name': row.name
        }
      })
    },
    getCityList (params) {
      this.cityListTableLoading = true
      cityList(params).then(res => {
        this.cityListTableLoading = false
        if (res.status_code === 200) {
          this.cityList = res.data.data
          console.log('cityList为：', this.cityList)
          this.cityList.forEach(function (val) {
            val.grades = val.grades.join('、')
          })
          this.cityListPage.current_page = res.data.meta.pagination.current_page
          this.cityListPage.total = res.data.meta.pagination.total
          this.cityListPage.per_page = res.data.meta.pagination.per_page
        }
      })
    },

    createCity (cityName) {
      createCity(cityName).then(res => {
        if (res.status_code === 200) {
          this.dialogCreateCityVisible = false
          this.cityNameForm.name = null
          this.$message.success('增加成功')
          this.getCityList([])
        } else {
          this.$message.error('操作失败')
          return false
        }
      })
    },

    uploadCityImage (params) {
      uploadCityImage(params).then(res => {
        if (res.status_code === 200) {
          this.dialogConfCityImageVisible = false
          this.cityImageForm.image_url = null
          this.cityImageForm.city_id = null
          this.$message.success('上传成功')
          this.getCityList([])
        } else {
          this.$message.error('上传失败')
        }
      })
    },

    delelteCity (params) {
      deleteCity(params).then(res => {
        if (res.status_code === 200) {
          this.dialogDeleteCityVisible = false
          this.deleteCityForm.id = null

          this.$message.success('删除成功')
          // TODO：删除过后从新获取当前page页
          this.getCityList([])
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    closeDeleteDialog () {
      this.dialogDeleteCityVisible = false
      this.deleteCityForm.id = null
    },

    // 图片上传
    setOssUrl (res) {
      if (res.res.status === 200) {
        this.cityImageForm.image_url = ''
        this.cityImageForm.image_url = res.url
      } else {
        this.$message.error('图片上传失败')
        return false
      }
    },

    clipboardSuccessHandler (value ) {
      let cityName = ''
      for (const item of this.cityList){
        if (item.front_url === value.text) {
          cityName = item.name
          break
        }
      }
      this.$message.success('城市：【' + cityName + '】 复制链接成功！')
    },

    clipboardErrorHandler (value) {
      let cityName = ''
      for (const item of this.cityList){
        if (item.front_url === value.text) {
          cityName = item.name
          break
        }
      }
      this.$message.error('城市：【' + cityName + '】 复制链接失败！')
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
    border-color: #409EFF;
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
