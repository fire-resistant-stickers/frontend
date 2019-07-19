<template>
  <v-layout class="dash-holder">
    <v-flex class="dash-box" elevation-4 xs10 md7 lg5>
      <div class="dash-box-wrapper">
        <v-layout align-center justify-end>
          <h1>대시보드</h1>
          <v-flex align-self-end>
            <v-btn fab flat @click="$router.push('/search')">
              <v-icon>search</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout class="profile-container" elevation-4>
          <v-icon>account_circle</v-icon>
          <v-layout class="profile-info" align-start column>
            <h3>{{ email }}</h3>
            <div>현재까지 {{ nodesCnt }}개의 노드 조회</div>
            <div>{{ daysCnt }}일 째 StuFlo와 함께하는 중</div>
          </v-layout>
        </v-layout>
        <v-flex>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="(item,i) in 5" :key="i">
              <template v-slot:header>
                <div>Item</div>
              </template>
              <v-card>
                <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    email: "devstdio@stdio.dev",
    nodesCnt: 0,
    daysCnt: 0
  }),
  computed: {
    getToken(){
      return this.$store.state.token
    }
  },
  created(){
    if(this.getToken){
      axios.post(this.$store.state.mainPath+'/auth/getUserProfile',{token:this.getToken})
      .then(data=>{
      })
    }
    else{
      this.$router.push('/login')
    }
  }
};
</script>

<style>
html {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background: #5295ea;
  background: -webkit-linear-gradient(left, #5295ea 0%, #8b79db 100%);
  background: -moz-linear-gradient(left, #5295ea 0%, #8b79db 100%);
  background: -ms-linear-gradient(left, #5295ea 0%, #8b79db 100%);
  background: -o-linear-gradient(left, #5295ea 0%, #8b79db 100%);
  background: linear-gradient(to right, #5295ea 0%, #8b79db 100%);
  text-align: center;
  color: white;
}
.dash-holder {
  height: 100vh;
}
.dash-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  max-width: 50vw;
  height: 70vh;
  background: white;
  border-radius: 10px;
  color: #222;
}
.dash-box-wrapper {
  width: 70%;
    display:flex;
  flex-direction: column;
  align-items: center;
}
.profile-container {

  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  padding: 5% 10%;
}
.profile-info {
  margin-left: 20px;
}
</style>