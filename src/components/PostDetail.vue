<template>
   <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" lg="10">
          <h1>{{post.title}}</h1>
          <p>{{ post.modify_dt }}, written by {{ post.owner }}</p>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" lg="7">
          <v-card class="pa-2" outlined tile>
            <p style="white-space: pre-wrap;">
              {{ post.content }}
            </p>
            <div>
              <strong>Tags:</strong>
              <v-chip class="ma-2 my-hover" outlined v-for="(tag, index) in post.tags" :key="index"
              @click="serverPage(tag)"
              >{{tag}}
              
              </v-chip>

            </div>
          </v-card>

        </v-col>
        <v-col cols="12" sm="4" lg="3">
          <v-card class="pa-2 mb-5" tile>
            <p>Prev Post</p>
            <!-- post.prev 값이 있는 경우에만 컴파일됨 -->
            <h2 v-if="post.prev" @click="fetchPostDetail(post.prev.id)" class="my-hover"> {{post.prev.title}}</h2>
          </v-card>
          <v-card class="pa-2 mb-5" tile>
            <p>Next Post</p>
            <h2 v-if="post.next" @click="fetchPostDetail(post.next.id)" class="my-hover">{{post.next.title}}</h2>
          </v-card>
          <v-card class="pa-2 mb-5" tile>
            <p>Tag Cloud</p>
            <v-chip v-for="(tag, index) in tagCloud" :key="index" @click="serverPage(tag.name)" class="ma-2 my-hover"
             :color="tag.color" text-color="white">
              <v-avatar left :class="tag.color+' darken-4'">{{tag.count}}
              </v-avatar>
              {{tag.name}}
            </v-chip>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from "axios"

export default {

  data: () => ({
    post: {},
    tagCloud: [],
  }),
  // created() : template compile 실행, axios 처리 이전에 템플릿을 컴파일하게 되면 post는 {} 형태이며 여기에서 해당 값 초기화 가능
  created() {
    console.log("Created()...");
    // javascript location 객체 이용, chrome 개발 도구에서 확인 가능, 만약 앞의 값이 false라면 2라는 값은 테스트를 위해 사용
    // 3도 하드코딩된 부분으로 정규표현식 형태로 개선 필요 
    // const postId = location.pathname.split('/')[3] || 2;
    const params = new URL(location).searchParams;
    const postId = params.get('id');
    this.fetchPostDetail(postId);
    this.fetchTagCloud();
  },

  methods: {
    fetchPostDetail(postId){
      console.log("fetchPostDetail()...");
      axios.get(`/api/post/${postId}/`)
      .then(res => {
        console.log("Post Detail Get Res", res);
        // 서버에서 응답을 받은 경우 data가 추가됨
        this.post = res.data;
      })
      .catch(err => {
        console.log("Post Detail Get ERR.Response", err.response);
        alert(err.response.status+' '+err.response.statusText);
      });
    },
    fetchTagCloud(){
      console.log("fetchTagCloud()...");
      axios.get(`/api/tag/cloud/`)
      .then(res => {
        console.log("Tag Cloud Get Res", res);

        // 서버에서 응답을 받은 경우 data가 추가됨
        this.tagCloud = res.data;

        //tag.weight -> tag.color
        this.tagCloud.forEach(element => {
          if(element.weight === 3) element.color = 'green';
          else if (element.weight === 2) element.color = 'blue-gray';
          else if (element.weight === 1) element.color = 'grey';
        })
      })
      .catch(err => {
        console.log("Tag Cloud Get ERR.Response", err.response);
        alert(err.response.status+' '+err.response.statusText);
      });
    },

    serverPage(tagname) {
      console.log("ServerPage()...", tagname);
      //location.href = `/blog/post/list/?tagName=${tagname}`;
      location.href = `/post_list.html?tagName=${tagname}`;

    }

  },
}
</script>

<style scoped>
.my-hover:hover{
  cursor: pointer;
  font-style: italic;
}
</style>