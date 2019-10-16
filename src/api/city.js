import request from '@/utils/request'

export function cityList(params) {
  return request({
    url: 'admin/city/list',
    method: 'GET',
    params: params
  })
}

export function createCity(city_name) {
  return request({
    url: 'admin/city/create',
    method: 'POST',
    data: city_name
  })
}

export function uploadCityImage (params) {
  return request({
    url: 'admin/city/uploadImg',
    method: 'POST',
    data: params
  })
}

export function deleteCity (params) {
  return request({
    url: 'admin/city/delete',
    method: 'POST',
    data: params
  })
}
