<template>
  <v-container>
    <!-- :을 붙여야  "" 안에 있는 값을 vue javascript 문법으로 해석 "'5'"->string, "5"-> 숫자 -->
    <v-data-table
      :headers="headers"
      :items="posts"
      :search="search"
      sort-by="names"
      class="elevation-1"
      :items-per-page="5"
      @click:row="serverPage"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search Title or Description"
          class="mx-4"
        ></v-text-field>
        <v-toolbar flat color="white">
          <v-toolbar-title>Post List</v-toolbar-title>
          <span v-if="tagname" class="body-1 font-italic ml-3"
            >(with {{ tagname }} tageed)</span
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- dialog 밖에 click버튼이 있는 경우 stop으로 전파를 막아야 함 -->
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click.stop="dialogOpen(item, 'create')"
          >
            New Post
          </v-btn>
        </v-toolbar>
      </template>
      <!-- item은 v table row 한개를 의미, post 레코드에 대한 정보를 담고 있음 -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click.stop="dialogOpen(item, 'update')">
          mdi-pencil
        </v-icon>
        <v-icon small @click.stop="deletePost(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form id="post-form" ref="postForm">
            <!-- <div class="mx-3">
              <div class="mx-1">
                <v-text-field name="id" label="ID" v-model="editedItem.id" readonly></v-text-field>
              </div>
            </div> -->
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  name="title"
                  label="TITLE"
                  v-model="editedItem.title"
                ></v-text-field>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  name="description"
                  label="DESCRIPTION"
                  v-model="editedItem.description"
                ></v-text-field>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-textarea
                  outlined
                  name="content"
                  label="CONTENT"
                  v-model="editedItem.content"
                ></v-textarea>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  name="owner"
                  label="OWNER"
                  readonly
                  v-model="editedItem.owner"
                ></v-text-field>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  name="tags"
                  label="TAGS"
                  v-model="editedItem.tags"
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import EventBus from './event_bus';

export default {
  name: 'PostList',

  data: () => ({
    dialog: false,
    headers: [
      // {
      //   text: 'ID',
      //   align: 'start',
      //   sortable: false,
      //   value: 'id',
      // },
      // value 항목에 django에서 설정한 column명으로 작성
      { text: '제 목', value: 'title' },
      { text: '요 약', value: 'description' },
      { text: '수정일', value: 'modify_dt' },
      { text: '작성자', value: 'owner' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    posts: [],
    editedIndex: -1,
    tagname: '',
    editedItem: {},
    actionKind: '',
    me: { username: 'Anonymous' },
    search: '',
    item: '',
  }),

  computed: {
    formTitle() {
      // return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      return this.actionKind === 'create' ? 'Create Item' : 'Edit Item';
    },
  },

  created() {
    // 전역변수처럼 동작
    const params = new URL(location).searchParams;
    this.tagname = params.get('tagName');
    this.fetchPostList();

    // event me_change와 event handler 등록
    // 이벤트를 받는 컴포넌트 등록
    // EventBus.$on('이벤트명', (데이터)=>{})
    EventBus.$on('me_change', (val) => {
      this.me = val;
    });
  },

  methods: {
    fetchPostList() {
      console.log('fetchPostList()...', this.tagname);

      let getUrl = '';
      if (this.tagname) getUrl = `/api/post/list/?tagname=${this.tagname}`;
      else getUrl = `/api/post/list/`;

      // get() -> django로 보낼 api path url 입력
      axios
        .get(getUrl)
        .then((res) => {
          console.log('Post List Get Res', res);
          this.posts = res.data;
        })
        .catch((err) => {
          console.log('Post List Get ERR.Res', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },

    serverPage(item) {
      console.log('serverPage()...', item);
      // 상용 location.href = `/blog/post/${item.id}`;

      //개발용
      location.href = `/post_detail.html?id=${item.id}`;
    },

    dialogOpen(item, actionKind) {
      console.log('dialogOpen()..', actionKind, item);

      // if (this.me.username === 'Anonymous') {
      //   alert("Please login First!");
      //   return;
      // }
      this.actionKind = actionKind;

      if (this.actionKind === 'create') {
        // 수정하지 않음
        this.editedIndex = -1;
        this.editedItem = {};
      } else {
        // posts array 내 item 객체의 array index 가져옴
        this.editedIndex = this.posts.indexOf(item);
        // object assign method는 앞 인자에 설정한 객체를 기준으로 뒤 인자 객체를 병합하여 새로운 객체를 만듬(shallow copy)
        this.editedItem = Object.assign({}, item);
      }

      this.dialog = true;
    },

    cancel() {
      console.log('cancel()..');
      this.dialog = false;
    },

    save() {
      console.log('save()..', this.actionKind);
      if (this.actionKind === 'create') this.createPost();
      else this.updatePost();

      this.dialog = false;
    },

    createPost() {
      console.log('createPost()..');
      const postData = new FormData(document.getElementById('post-form'));
      axios
        .post('/api/post/create/', postData)
        .then((res) => {
          console.log('Create Post Get Res', res);
          // 새로 입력한 레코드의 정보를 받아 다시 입력
          this.posts.push(res.data);
        })
        .catch((err) => {
          console.log('Create Post ERR.Response', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },
    updatePost() {
      console.log('updatePost()..');

      const postData = new FormData(document.getElementById('post-form'));

      // Post table 의 owner 항목이 foreign key로 설정되어 있는데 user table 의 pk가 id이므로 둘의 값을 맞추지 않으면
      // django에서 form 유효성 검사를 통과할 수 없음
      postData.set('owner', this.me.id);

      axios
        .post(`/api/post/${this.editedItem.id}/update/`, postData)
        .then((res) => {
          console.log('Update Post Get Res', res);
          // 해당 index에서 1개의 객체를 변경
          this.posts.splice(this.editedIndex, 1, res.data);
        })
        .catch((err) => {
          console.log('Update Post ERR.Response', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },

    deletePost(item) {
      console.log('deleteItem()...', item);

      // if (this.me.username === 'Anonymous') {
      //   alert("Please login First!");
      //   return;
      // }
      if (!confirm('Are you sure to delete?')) return;
      axios
        .delete(`/api/post/${item.id}/delete/`)
        .then((res) => {
          console.log('Delete Post Res', res);
          const index = this.posts.indexOf(item);
          this.posts.splice(index, 1);
        })
        .catch((err) => {
          console.log('Delete Post ERR.Response', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
.v-data-table >>> tbody > tr {
  cursor: pointer;
}
</style>
