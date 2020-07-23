const parseUrl = require('url').parse

const routes = {
    get:[],
    post:[],
    head:[],
    put:[],
    delete:[]
}

/**
 * 注册route规则
 * 
 * route.map({
 *    method:'post',
 *    url:/\/blog\/post\/(\d+)\/?$/i,
 *    controller: 'blog',
 *    action: 'showBlogPost'
 *})
 */

 const map = (dict) => {
    if(!dict || !dict.method || !dict.controller) return
    const method = dict.method ?  dict.method.toLowerCase() : 'get'
    routes[method].push({
        u: dict.url,
        c: dict.controller,
        a: dict.action || 'index'
    })
}

const getActionInfo = (url, method) => {
    const r = {
        controller: null,
        action: null,
        args: null,
    }
    method = method ? method.toLowerCase() : 'get'
    // url: /blog/index?path=1 则pathname为: /blog/index
    const pathName = parseUrl(url).pathname
    const m_routes = routes[method]
    console.log('m_routes',m_routes,method);
    

    for(let i in m_routes){
        // 正则匹配
        r.args = m_routes[i].u.exec(pathName)
        if(r.args){
            r.controller = m_routes[i].c
            r.action = m_routes[i].a
            r.args.shift()
            break
        }
    }
    // 如果匹配到route，r大概是{controller:'blog',action:'index',args:['1']}
    return r
}

exports.map = map
exports.getActionInfo = getActionInfo