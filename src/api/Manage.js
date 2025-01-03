import request from '@/utils/request'
let url = 'http://localhost:44321/api'

export function GetOrderWeightList(data) {
    return request({
      url: '/api/Weigh/GetOrderWeightList',
      method: 'POST',
      data
    })
  }
  
export function GetSalesWeightList(data) {
    return request({
      url: '/api/Weigh/GetSalesWeightList',
      method: 'POST',
      data
    })
  }
export function GetWeightByID(data) {
    return request({
      url: '/api/Weigh/GetWeightByID?wType='+data.wType+'&WID='+data.ID,
      method: 'GET',
      data
    })
  }
  

  export function UpdateWeightByID(data) {
      return request({
        url: '/api/Weigh/UpdateWeightByID',
        method: 'POST',
        data
      })
    }

    export function GetMaintenanceWeightList(data) {
        return request({
          url: '/api/Weigh/GetMaintenanceWeightList',
          method: 'POST',
          data
        })
      }
      
export function GetYHWeightByID(data) {
    return request({
      url: '/api/Weigh/GetYHWeightByID?wType='+data.wType+'&WID='+data.ID,
      method: 'GET',
      data
    })
  }
  
  export function AddMaintenance(data) {
    return request({
      url: '/api/Weigh/AddMaintenance',
      method: 'POST',
      data
    })
  }
    
  
export function DeleteYHWeightByID(data) {
    return request({
      url: '/api/Weigh/DeleteYHWeightByID?WID='+data.ID,
      method: 'GET',
      data
    })
  }