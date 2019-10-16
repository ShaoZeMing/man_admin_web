import request from '@/utils/request'

export function activityList (params) {
  return request({
    url: 'admin/activity/list',
    method: 'GET',
    params: params
  })
}
export function activityDelete (params) {
  return request({
    url: 'admin/activity/delete',
    method: 'POST',
    params: params
  })
}
export function activityAddOrEdit (params) {
  return request({
    url: 'admin/activity/addOrEdit',
    method: 'POST',
    params: params
  })
}
export function getActivityCourse (data) {
  return request({
    url: 'admin/course/getActivityCourse',
    method: 'GET',
    params: data
  })
}
// 活动课程下拉列表
export function getOptionActivityCourse (data) {
  return request({
    url: 'admin/course/getOptionActivityCourse',
    method: 'GET',
    params: data
  })
}
export function deleteActivityCourse (params) {
  return request({
    url: 'admin/activity/deleteActivityCourse',
    method: 'POST',
    params: params
  })
}
// 新增活动课程
export function addActivityCourse (params) {
  return request({
    url: 'admin/activity/addActivityCourse',
    method: 'POST',
    params: params
  })
}

// 课程列表
export function courseList (data) {
  return request({
    url: 'admin/course/list',
    method: 'GET',
    params: data
  })
}
// 新增编辑课程
export function courseAddOrEdit (data) {
  return request({
    url: 'admin/course/addOrEdit',
    method: 'POST',
    params: data
  })
}
// 删除课程
export function courseDelete (data) {
  return request({
    url: 'admin/course/delete',
    method: 'POST',
    params: data
  })
}
// 年级列表
export function gradeList (data) {
  return request({
    url: 'admin/course/gradeList',
    method: 'GET',
    params: data
  })
}
