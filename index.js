const http = require('http')
const querystring  = require('querystring')
const route = require('./router')
const fs = require('fs')
const config = require('./config/config')
const path = require('path')
const url = require('url')

const runServer = (port = 8080) => {
    const server = http.createServer((req,res)=>{
        let _postData = ''
        req.on('data',(chunk)=>{
            console.log('data log...');
            
            _postData += chunk
        }).on('end',()=>{
            console.log('end log...');
            
            req.post = querystring.parse(_postData)
            handlerRequest(req,res)
        })
    }).listen(port)

    console.log('Server running at http://127.0.0.1:' + port);
}

const handlerRequest = (req,res) => {
    // 通过route来获取controller和action的信息
    const actionInfo = route.getActionInfo(req.url,req.method)
    // 如果route中有匹配到的action，则分发给对应的action
    if(actionInfo.action){
        // 假设controller都放到当前目录的controller目录里面，还记得require是怎么搜索module的么？
        const controller = require(`./controller/${actionInfo.controller}`) // ./controller/blog
        if(controller[actionInfo.action]){
            const ct = new controllerContext(req,res)
            // 动态调用
            controller[actionInfo.action].apply(ct, actionInfo.args)
        }else{
            // 报错
            handler500(req, res, 'Error: controller "' + actionInfo.controller + '" without action "' + actionInfo.action + '"')
        }
    }else{
        // 如果在route中没有匹配到，当做静态文件处理
        staticFileServer(req,res)
    }
}

const controllerContext = (req,res) => {
    this.req = req
    this.res = res

    this.handler404 = handler404
    this.handler500 = handler500
}

controllerContext.prototype.render = (viewName, context) => {
    viewEngin.render(this.req,this.res,viewName,context)
}

controllerContext.prototype.renderJson = (json) => {
    viewEngin.renderJson(this.req,this.res,json)
}

var handler404 = function(req, res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Page Not Found');
};

var handler500 = function(req, res, err){
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err);
};

const viewEngin = {
    render: (req,res,viewName,context) => {
        const fileName = path.join(__dirname,'views',viewsName)
        var output = Shotenjin.renderView(fileName,context)
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(output)
    },
    renderJson: (res,json) = {
        // TODO: 转化json
    } 
}

var staticFileServer = function(req, res, filePath){
    if(!filePath){
        filePath = path.join(__dirname, config.staticFileDir, url.parse(req.url).pathname);
    }
    path.exists(filePath, function(exists) {  
        if(!exists) {  
            handler404(req, res);  
            return;  
        }  
  
        fs.readFile(filePath, "binary", function(err, file) {  
            if(err) {  
                handler500(req, res, err);
                return;  
            }
            
            var ext = path.extname(filePath);
            ext = ext ? ext.slice(1) : 'html';
            res.writeHead(200, {'Content-Type': contentTypes[ext] || 'text/html'});
            res.write(file, "binary");
            res.end();
        });  
    });
};
var contentTypes = {
  "aiff": "audio/x-aiff",
  "arj": "application/x-arj-compressed",
  "asf": "video/x-ms-asf",
  "asx": "video/x-ms-asx",
  "au": "audio/ulaw",
  "avi": "video/x-msvideo",
  "bcpio": "application/x-bcpio",
  "ccad": "application/clariscad",
  "cod": "application/vnd.rim.cod",
  "com": "application/x-msdos-program",
  "cpio": "application/x-cpio",
  "cpt": "application/mac-compactpro",
  "csh": "application/x-csh",
  "css": "text/css",
  "deb": "application/x-debian-package",
  "dl": "video/dl",
  "doc": "application/msword",
  "drw": "application/drafting",
  "dvi": "application/x-dvi",
  "dwg": "application/acad",
  "dxf": "application/dxf",
  "dxr": "application/x-director",
  "etx": "text/x-setext",
  "ez": "application/andrew-inset",
  "fli": "video/x-fli",
  "flv": "video/x-flv",
  "gif": "image/gif",
  "gl": "video/gl",
  "gtar": "application/x-gtar",
  "gz": "application/x-gzip",
  "hdf": "application/x-hdf",
  "hqx": "application/mac-binhex40",
  "html": "text/html",
  "ice": "x-conference/x-cooltalk",
  "ief": "image/ief",
  "igs": "model/iges",
  "ips": "application/x-ipscript",
  "ipx": "application/x-ipix",
  "jad": "text/vnd.sun.j2me.app-descriptor",
  "jar": "application/java-archive",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "latex": "application/x-latex",
  "lsp": "application/x-lisp",
  "lzh": "application/octet-stream",
  "m": "text/plain",
  "m3u": "audio/x-mpegurl",
  "man": "application/x-troff-man",
  "me": "application/x-troff-me",
  "midi": "audio/midi",
  "mif": "application/x-mif",
  "mime": "www/mime",
  "movie": "video/x-sgi-movie",
  "mp4": "video/mp4",
  "mpg": "video/mpeg",
  "mpga": "audio/mpeg",
  "ms": "application/x-troff-ms",
  "nc": "application/x-netcdf",
  "oda": "application/oda",
  "ogm": "application/ogg",
  "pbm": "image/x-portable-bitmap",
  "pdf": "application/pdf",
  "pgm": "image/x-portable-graymap",
  "pgn": "application/x-chess-pgn",
  "pgp": "application/pgp",
  "pm": "application/x-perl",
  "png": "image/png",
  "pnm": "image/x-portable-anymap",
  "ppm": "image/x-portable-pixmap",
  "ppz": "application/vnd.ms-powerpoint",
  "pre": "application/x-freelance",
  "prt": "application/pro_eng",
  "ps": "application/postscript",
  "qt": "video/quicktime",
  "ra": "audio/x-realaudio",
  "rar": "application/x-rar-compressed",
  "ras": "image/x-cmu-raster",
  "rgb": "image/x-rgb",
  "rm": "audio/x-pn-realaudio",
  "rpm": "audio/x-pn-realaudio-plugin",
  "rtf": "text/rtf",
  "rtx": "text/richtext",
  "scm": "application/x-lotusscreencam",
  "set": "application/set",
  "sgml": "text/sgml",
  "sh": "application/x-sh",
  "shar": "application/x-shar",
  "silo": "model/mesh",
  "sit": "application/x-stuffit",
  "skt": "application/x-koan",
  "smil": "application/smil",
  "snd": "audio/basic",
  "sol": "application/solids",
  "spl": "application/x-futuresplash",
  "src": "application/x-wais-source",
  "stl": "application/SLA",
  "stp": "application/STEP",
  "sv4cpio": "application/x-sv4cpio",
  "sv4crc": "application/x-sv4crc",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tar": "application/x-tar",
  "tcl": "application/x-tcl",
  "tex": "application/x-tex",
  "texinfo": "application/x-texinfo",
  "tgz": "application/x-tar-gz",
  "tiff": "image/tiff",
  "tr": "application/x-troff",
  "tsi": "audio/TSP-audio",
  "tsp": "application/dsptype",
  "tsv": "text/tab-separated-values",
  "txt": "text/plain",
  "unv": "application/i-deas",
  "ustar": "application/x-ustar",
  "vcd": "application/x-cdlink",
  "vda": "application/vda",
  "vivo": "video/vnd.vivo",
  "vrm": "x-world/x-vrml",
  "wav": "audio/x-wav",
  "wax": "audio/x-ms-wax",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "wmx": "video/x-ms-wmx",
  "wrl": "model/vrml",
  "wvx": "video/x-ms-wvx",
  "xbm": "image/x-xbitmap",
  "xlw": "application/vnd.ms-excel",
  "xml": "text/xml",
  "xpm": "image/x-xpixmap",
  "xwd": "image/x-xwindowdump",
  "xyz": "chemical/x-pdb",
  "zip": "application/zip"
};

exports.runServer = runServer