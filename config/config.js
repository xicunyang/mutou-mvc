const route = require('./../router')
route.map({
    method: 'get',
    url:/\/blog\/?$/i,
    controller: 'blog',
    action: 'index'
})