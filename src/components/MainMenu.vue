<template lang="">
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="indigo" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Vue.js - Django Web Programming</v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- django url 형식으로 맞춰주는 경우  root '/'로 설정하면, '/templates' 에 html파일 존재 
            django url 형식으로 맞춰줄 필요가 없는 경우 root '/'로 설정하면 dist 폴더에 위치
            -->
      <!-- <v-btn text href="/">Home</v-btn>
            <v-btn text href="/blog/post/list/">Blog</v-btn>
            <v-btn text href="/admin/">Admin</v-btn> -->
      <!-- dev용 -->
      <v-btn text href="/home.html">Home</v-btn>
      <v-btn text href="/post_list.html">PostList</v-btn>
      <v-btn text href="/post_detail.html">PostDetail</v-btn>

      <v-spacer></v-spacer>
      <v-menu offset-y left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
            {{ me.username }}
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <template v-if="me.username === 'Anonymous'">
            <v-list-item @click="dialogOpen('login')">
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dialogOpen('register')">
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dialogOpen('pwdchg')">
              <v-list-item-title>Password Change</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- login dialog -->
    <v-dialog v-model="dialog.login" max-width="600">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title> Login Form </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-spacer></v-spacer>
          <v-form id="login-form" ref="loginForm">
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  prepend-icon="mdi-account"
                  name="username"
                  placeholder="user Id"
                  type="text"
                ></v-text-field>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="password"
                  placeholder="user Password"
                  type="password"
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancel('login')">Cancel</v-btn>
          <v-btn color="primary" class="mr-5" @click="save('login')">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- register dialog  -->
    <v-dialog v-model="dialog.register" max-width="600">
      <v-card class="elevation-12">
        <v-toolbar color="success" dark flat>
          <v-toolbar-title> Register Form </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-spacer></v-spacer>
          <v-form id="register-form" ref="registerForm">
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  prepend-icon="mdi-account"
                  name="username"
                  placeholder="user name"
                  type="text"
                ></v-text-field>
              </div>
            </div>
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="password1"
                  placeholder="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="password2"
                  placeholder="password again"
                  type="password"
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancel('register')">Cancel</v-btn>
          <v-btn color="success" class="mr-5" @click="save('register')"
            >Register</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- pwchange dialog  -->
    <v-dialog v-model="dialog.pwdchg" max-width="600">
      <v-card class="elevation-12">
        <v-toolbar color="warning" dark flat>
          <v-toolbar-title> Password Change Form </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-spacer></v-spacer>
          <v-form id="pwdchg-form" ref="pwdchgForm">
            <div class="mx-3">
              <div class="mx-1">
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="old_password"
                  placeholder="Old Password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="new_password1"
                  placeholder="New password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="new_password2"
                  placeholder="New password again"
                  type="password"
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancel('pwdchg')">Cancel</v-btn>
          <v-btn color="warning" class="mr-5" @click="save('pwdchg')"
            >PassWord Change</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from './event_bus';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default {
  data: () => ({
    drawer: null,
    dialog: {
      login: false,
      register: false,
      pwdchg: false,
    },
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard' },
      { title: 'Photos', icon: 'mdi-image' },
      { title: 'About', icon: 'mdi-help-box' },
    ],
    me: {
      username: 'Anonymous',
    },
  }),
  created() {
    console.log('Created()...');
    this.getUserInfo();
  },

  // 데이터 변경 확인 가능
  watch: {
    me(newVal, oldVal) {
      console.log('watch.me...', newVal, oldVal);
      // me 변경이 일어나면 new 데이터 전달
      // 이벤트를 보내는 컴포넌트 EventBus.$emit(이벤트명, 데이터);
      EventBus.$emit('me_change', newVal);
    },
  },
  methods: {
    dialogOpen(kind) {
      console.log('dialogOpen()...', kind);
      if (kind === 'login') {
        this.dialog.login = true;
      }
      if (kind === 'register') {
        this.dialog.register = true;
      }
      if (kind === 'pwdchg') {
        this.dialog.pwdchg = true;
      }
    },

    cancel(kind) {
      console.log('cancel()...', kind);
      if (kind === 'login') {
        this.$refs.loginForm.reset();
        this.dialog.login = false;
      }
      if (kind === 'register') {
        this.$refs.registerForm.reset();
        this.dialog.register = false;
      }
      if (kind === 'pwdchg') {
        this.$refs.pwdchgForm.reset();
        this.dialog.pwdchg = false;
      }
    },

    save(kind) {
      console.log('save()...', kind);
      if (kind === 'login') {
        this.login();
        this.dialog.login = false;
        this.$refs.loginForm.reset();
      }
      if (kind === 'register') this.register();
      this.dialog.register = false;
      this.$refs.registerForm.reset();

      if (kind === 'pwdchg') {
        this.pwdchg();
        this.dialog.pwdchg = false;
        this.$refs.pwdchgForm.reset();
      }
    },

    login() {
      console.log('login()....');
      const postData = new FormData(document.getElementById('login-form'));

      axios
        .post('/api/login/', postData)
        .then((res) => {
          console.log('Login Post RES', res);
          //alert(`user ${res.data.username} login OK`);
          this.me = res.data;
        })
        .catch((err) => {
          console.log('Login Post ERR.RESPONSE', err.response);
          alert('login NOK');
        });
    },
    register() {
      console.log('register()....');
      const postData = new FormData(document.getElementById('register-form'));

      axios
        .post('/api/register/', postData)
        .then((res) => {
          console.log('Register Post RES', res);
          alert(`user ${res.data.username} created OK`);
        })
        .catch((err) => {
          console.log('Register Post ERR.RESPONSE', err.response);
          alert('register NOK');
        });
    },
    pwdchg() {
      console.log('pwdchg()....');
      const postData = new FormData(document.getElementById('pwdchg-form'));

      axios
        .post('/api/pwdchg/', postData)
        .then((res) => {
          console.log('pwdchg Post RES', res);
          alert(`user ${this.me.username} password change OK`);
        })
        .catch((err) => {
          console.log('pwdchg Post ERR.RESPONSE', err.response);
          alert('pwdchg NOK');
        });
    },
    logout() {
      console.log('logout()....');
      axios
        .get('/api/logout/')
        .then((res) => {
          console.log('Logout Get RES', res);
          alert(`user ${this.me.username} logout OK`);
          this.me = { username: 'Anonymous' };
        })
        .catch((err) => {
          console.log('Logout Get ERR.RESPONSE', err.response);
          alert('Logout NOK');
        });
    },

    getUserInfo() {
      console.log('getUserInfo()....');
      axios
        .get('/api/me/')
        .then((res) => {
          console.log('getUserInfo Get RES', res);
          this.me = res.data;
        })
        .catch((err) => {
          console.log('getUserInfo ERR.RESPONSE', err.response);
          alert(err.response.status + ' ' + err.response.statusText);
        });
    },
  },
};
</script>

<style lang=""></style>
