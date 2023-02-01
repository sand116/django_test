<template>
  <v-app id="inspire">
    <MainMenu>
    </MainMenu>

    <v-main>
      <PostDetail></PostDetail>
    </v-main>
    <v-footer app>
      <span>&copy; 2023</span>
    </v-footer>
  </v-app>
</template>

<script>
import PostDetail from '../components/PostDetail.vue';
import MainMenu from '../components/MainMenu.vue';


export default {
  components: { PostDetail, MainMenu },
  data: () => ({
    //drawer: null
  }),
}
</script>