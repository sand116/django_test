<template>
  <v-app id="inspire">
    <MainMenu></MainMenu>

    <v-main>
      <PostList></PostList>
    </v-main>
    <v-footer app>
      <span>&copy; 2023</span>
    </v-footer>
  </v-app>
</template>

<script>
import PostList from '../components/PostList.vue';
import MainMenu from '../components/MainMenu.vue';

export default {
  components: { PostList, MainMenu },
  data: () => ({
    //drawer: null
  }),
}
</script>