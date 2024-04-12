<template>
  <div id="app">
    <InstagramSearch />
  </div>
</template>

<script>
import InstagramSearch from './components/InstagramSearch.vue';

export default {
  name: 'App',
  components: {
    InstagramSearch
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
