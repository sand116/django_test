<template>
  <v-app id="inspire">
    <MainMenu>
    </MainMenu>
    <v-main>
      <HelloWorld></HelloWorld>
    </v-main>
    <v-footer app>
      <span>&copy; 2023</span>
    </v-footer>
  </v-app>
</template>

<script>
import MainMenu from '../components/MainMenu.vue';
import HelloWorld from '../components/HelloWorld.vue';

export default {
  components: { HelloWorld, MainMenu },
  data: () => ({
    //drawer: null
  }),
}
</script>