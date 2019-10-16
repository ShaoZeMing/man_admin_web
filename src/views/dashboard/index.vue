<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }},你好，控制台没有什么东西可以看，下面是图片上传组件使用示例</div>
    <!-- 上传阿里云组件示例 -->
    <upload-oss :after-upload="setOssUrl"
                :image-url="imageUrl">
    </upload-oss>
    <div class="dashboard-text">下面是日期组件使用示例(包括默认值)</div>
    <p>组件值：{{ full_date }}</p>
    <el-date-picker v-model="full_date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
    </el-date-picker>
    <div class="dashboard-text">下面是多选组件使用示例(包括默认值)</div>
    <p>组件值：{{ select_value }}</p>
    <el-select v-model="select_value"
               multiple
               placeholder="请选择">
      <el-option v-for="item in select_data"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadOss from '@/components/UploadOss'
export default {
  name: 'Dashboard',
  components: {
    UploadOss
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return {
      imageUrl: this.getImgUrl(),   //获取默认已上传地址
      full_date: ["2019-11-04", "2019-11-20"],
      select_data: [
        { 'id': 1, 'name': '一年级' },
        { 'id': 2, 'name': '二年级' },
        { 'id': 3, 'name': '三年级' },
        { 'id': 4, 'name': '四年级' },
        { 'id': 5, 'name': '五年级' },
        { 'id': 6, 'name': '六年级' },
      ],
      select_value: [
        1,
        2,
      ]
    }
  },
  methods: {
    // 上传阿里云成功后返回的数据体，用于各个页面处理获取并赋值给表单
    setOssUrl ($rse) {
      console.log(123456)
      console.log($rse)
    },
    //获取默认已上传图片地址
    getImgUrl () {
      return "http://xthk-guarden.oss-cn-shenzhen.aliyuncs.com/images/activity/201910/1570957081319.jpeg"
    },
    changeDate () {
      debugger
      console.log(this.full_date);
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
