import request from '@/utils/request'

export function getConfigGrades(city_id) {
  return request({
    url: 'admin/grade/getConfigGrades',
    method: 'GET',
    params: city_id
  })
}

export function gradeList (city_id) {
  return request({
    url: 'admin/grade/getExpansionList',
    method: 'GET',
    params: city_id
  })
}

export function addExpansionByCity (data) {
  return request({
    url: 'admin/grade/addExpansionByCity',
    method: 'POST',
    data: data
  })
}

export function delExpansion (data) {
  return request({
    url: 'admin/grade/delExpansion',
    method: 'POST',
    data: data
  })
}


export function confWeixin (data) {
  return request({
    url: 'admin/grade/confWeixin',
    method: 'POST',
    data: data
  })
}




