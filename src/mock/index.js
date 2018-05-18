import Mock from 'mockjs'

Mock.mock(/\.json/, function(options) {
    return options
});

Mock.mock(/\/test/, 'get', function (options) {
  return options
  // return {
  //   status: 0,
  //   msg: 'ok'
  // }
});

// Mock.mock('/api/advertise/list', 'get', function(){
//   return {
//     status: 0,
//     data: [{
//       id: '101',
//       name: '王小虎01',
//       create_time: '2016-05-02',
//       status: 0
//     }, {
//       id: '102',
//       name: '王小虎',
//       create_time: '2016-05-04',
//       status: 1
//     }, {
//       id: '103',
//       name: '王小虎',
//       create_time: '2016-05-01',
//       status: 2
//     }, {
//       id: '104',
//       name: '王小虎',
//       create_time: '2016-05-03',
//       status: 3
//     }]
//   }
// });

/**
  广告主列表
*/
Mock.mock('/api/advertiser/list', 'get', function(){
  return Mock.mock({
    status: 0,
    'data|10':[{
      id: '@id',
      name: '@cword(3, 10)',
      create_time: '@date("yyyy-MM-dd")',
      status: '@pick([0, 1, 2, 3])'
    }]
  })
})
/**
  广告主数据显示
*/
Mock.mock('/api/advertiser/data', 'get', function(){
  return Mock.mock({
    status: 0,
    'data|10':[{
      'id': '@id',
      'name': '@cword(3, 10)',
      'status': '@pick([1, 2, 3])',
      'budget_status|0.2': 1,
      'spend_status|0.2': 1,
      'consumed|100-1000000': 100,
      'pv|100-1000000': 100,
      'click|100-1000000': 100,
      'ctr|1.2': 1,
      'cpc|1-10.2': 1,
      'cpm|1-10.2': 1,
      'leads|100-1000000': 1,
      'cpl|1-1000': 1
    }]
  })
})

export default Mock
