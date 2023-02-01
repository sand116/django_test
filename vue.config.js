const { defineConfig } = require('@vue/cli-service')
const path = require('path');
// const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  //dev server
  devServer: {
    //index: 'home.html',
    // /api 혹은 /api로 시작하면 django server로 넘겨줌
    proxy: {
      '^/api' :{
        target : 'http://127.0.0.1:8000'
      },
      '^/admin' :{
        target : 'http://127.0.0.1:8000'
      },
      '^/static' :{
        target : 'http://127.0.0.1:8000'
      },
    }
    // proxy: 'http://127.0.0.1:8000', //XHR Request만 proxy 처리됨


  },

  // default 값과 동일 
  // outputDir: 'dist',
  // publicPath: '/',
  // assetsDir: '',

  // django 내 폴더로 옮기려면 django settings.py 의 static 설정과 맞춰줘야함
  // assetsDir: 'static' -> /dist/static에 파일 생성

  pages: {
    
    home:{
      template: 'public/index.html',
      entry: 'src/pages/main_home.js',
      filename: 'home.html',
      title: 'VueDjangoPhoto/home.html',
      minify: 'false',
    },
    post_list:{
      template: 'public/index.html',
      entry: 'src/pages/main_post_list.js',
      filename: 'post_list.html',
      title: 'VueDjangoPhoto/post_list.html',
      minify: 'false',
    },
    post_detail:{
      template: 'public/index.html',
      entry: 'src/pages/main_post_detail.js',
      filename: 'post_detail.html',
      title: 'VueDjangoPhoto/post_detail.html',
      // minify : 개발 시 false, 배포 시 true로 설정
      minify: 'false',
    }
  },
  css: {
    extract: {ignoreOrder: true},
  }
  // configureWebpack: {
  //   plugins: [ 
  //     new FileManagerPlugin({
  //       events: {
  //       // 빌드 작업 전 삭제 **reculsive
  //       onStart: {
  //         delete: [
  //           '../backend/mysite/static/**/',
  //           '../backend/mysite/templates/**/',
  //         ],
  //       },

  //       // 빌드 작업 후 
  //       onEnd: {
  //         copy: [
  //           { source: 'dist/static', destination: '../backend/mysite/static/' },
  //           { source: 'dist/favicon.ico', destination: '../backend/mysite/static/img/' },
  //           { source: 'dist/home.html', destination: '../backend/mysite/templates/' },
  //           { source: 'dist/post*.html', destination: '../backend/mysite/templates/blog/' },
  //         ],
  //       },
  //     }
  //   }),

  //   ]
  // },

})
