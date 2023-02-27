<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="10">
        <h1>{{ post.title }}</h1>
        <p>{{ post.modify_dt }}, written by {{ post.owner }}</p>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" lg="7">
        <v-card class="pa-2" outlined tile>
          <p style="white-space: pre-wrap">
            {{ post.content }}
          </p>
          <div>
            <strong>Tags:</strong>
            <v-chip
              class="ma-2 my-hover"
              outlined
              v-for="(tag, index) in post.tags"
              :key="index"
              @click="serverPage(tag)"
              >{{ tag }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" lg="3">
        <v-card class="pa-2 mb-5" tile>
          <p>Prev Post</p>
          <!-- post.prev 값이 있는 경우에만 컴파일됨 -->
          <h2
            v-if="post.prev"
            @click="fetchPostDetail(post.prev.id)"
            class="my-hover"
          >
            {{ post.prev.title }}
          </h2>
        </v-card>
        <v-card class="pa-2 mb-5" tile>
          <p>Next Post</p>
          <h2
            v-if="post.next"
            @click="fetchPostDetail(post.next.id)"
            class="my-hover"
          >
            {{ post.next.title }}
          </h2>
        </v-card>
        <v-card class="pa-2 mb-5" tile>
          <p>Tag Cloud</p>
          <v-chip
            v-for="(tag, index) in tagCloud"
            :key="index"
            @click="serverPage(tag.name)"
            class="ma-2 my-hover"
            :color="tag.color"
            text-color="white"
          >
            <v-avatar left :class="tag.color + ' darken-4'"
              >{{ tag.count }}
            </v-avatar>
            {{ tag.name }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

/*
beforeCreate : data 와 method 속성이 아직 정의되어있지 않으며, 돔에 접근하지 못하는 상태
create : data 와 method 속성 정의된 상태로 this 등으로 data나 methods에 접근 가능하나 돔에 부착되기 전이므로 돔 요소 접근 불가
         컴포넌트 생성되고 나서 실행되는 단계로 서버에서 데이터를 요청해서 받아오는 로직 수행하기 좋음
beforeMount : template 속성에 지정한 마크업속성을 render() 함수로 변환한 후 el 속성의 지정한 화면 요소에 인스턴스를 부착하기 전에 호출되는 단계
              로 render() 함수 이전 로직을 추가하기 좋음
mounted : template 속성에 정의한 화면 요소에 접근 가능하여 화면 요소를 제어하는 로직을 수행하기 좋은 단계이지만 부착되자마자 
        실행되기 때문에 하위 컴포넌트나 외부라이브러리에 의해 최종 html 코드로 변환되는 시점과 다를 수 있음 
beforeUpdate : el 속성에 지정한 화면요서에 인스턴스가 부착되고나서 화면에 치환된 후, 반응성 제공함.  
              $watch 속성으로 감시하며 감시하고 있는 데이터가 변경되면 호출됨.
update : 데이터가 변경되고 나서 가상돔으로 다시 화면을 그리고 실행되는 단계임.  
          데이터 변경으로 화면 요소 변경까지 완료된 시점으로 변경 후 화면 요소 제어와 관련된 로직 추가하기 좋음.
          따라서, beforeupdate에서 데이터 갱신 로직, update에서는 변경 데이터의 화면 요소와 관련된 로직 추가  
*/
export default {
  data: () => ({
    post: {},
    tagCloud: [],
  }),
  created() {
    console.log('Created()...');
    // const postId = location.pathname.split('/')[3] || 9;
    // javascript location 객체 이용, chrome 개발 도구에서 확인 가능
    // 만약 앞의 값이 false라면 2라는 값은 테스트를 위해 사용
    // 3도 하드코딩된 부분으로 정규표현식 형태로 개선 필요

    const params = new URL(location).searchParams;
    const postId = params.get('id') || 9;
    this.fetchPostDetail(postId);
    this.fetchTagCloud();
  },

  methods: {
    fetchPostDetail(postId) {
      console.log('fetchPostDetail()...');
      axios
        .get(`/api/post/${postId}/`)
        .then((res) => {
          console.log('Post Detail Get Res', res);
          // 서버에서 응답을 받은 경우 data가 추가됨
          this.post = res.data;
        })
        .catch((err) => {
          console.log('Post Detail Get ERR.Response', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },
    fetchTagCloud() {
      console.log('fetchTagCloud()...');
      axios
        .get(`/api/tag/cloud/`)
        .then((res) => {
          console.log('Tag Cloud Get Res', res);

          // 서버에서 응답을 받은 경우 data가 추가됨
          this.tagCloud = res.data;

          //tag.weight -> tag.color
          this.tagCloud.forEach((element) => {
            if (element.weight === 3) element.color = 'green';
            else if (element.weight === 2) element.color = 'blue-gray';
            else if (element.weight === 1) element.color = 'grey';
          });
        })
        .catch((err) => {
          console.log('Tag Cloud Get ERR.Response', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },

    serverPage(tagname) {
      console.log('ServerPage()...', tagname);
      // location.href = `/blog/post/list/?tagName=${tagname}`;
      location.href = `/post_list.html?tagName=${tagname}`;
    },
  },
};
</script>

<style scoped>
.my-hover:hover {
  cursor: pointer;
  font-style: italic;
}
</style>
