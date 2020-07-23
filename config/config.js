const route = require('./../router')
route.map(
    {
        method: 'get',
        url:/\/blog\/?$/i,
        controller: 'blog',
        action: 'index'
    },
)
route.map(
    {
        method: 'post',
        url:/\/blog-post\/?$/i,
        controller: 'blog',
        action: 'indexPost'
    },
)

exports.staticFileDir = 'static';
