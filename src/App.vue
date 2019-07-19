<template>
  <router-view />
</template>

<script>
import axios from 'axios'
export default {
  name: "App",
  components: {},
  data() {
    return {
      //
    };
  },
  created(){
    axios.get(this.$store.state.mainPath+"/console/getData")
    .then(data=>{
      this.$store.state.data = data.data.data
    })
  }
};
</script>

<style>
html {
  font-family: "Spoqa Han Sans", sans-serif;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
</style>