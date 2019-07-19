<template>
  <v-layout class="signup-holder">
    <v-flex class="signup-box" elevation-4 xs10 md7 lg5>
      <div class="signup-box-wrapper">
        <h1>계정 만들기</h1>
        <v-text-field v-model="email" label="E-mail"></v-text-field>
        <v-text-field v-model="password" label="비밀번호"></v-text-field>
        <v-checkbox v-model="checkbox" color="#3F68E4" label="개인정보 취급 방침 및 이용 약관 동의"></v-checkbox>
        <v-btn color="#3F68E4" class="white--text btn-signup" @click="signup" round>계정 만들기</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    email: "",
    password: ""
  }),
  methods: {
    signup() {
      alert("SIGNUP ALERT")
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
.signup-holder {
  height: 100vh;
}
.signup-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  max-width: 50vw;
  height: 50vh;
  background: white;
  border-radius: 10px;
  color: #222;
}
.signup-box-wrapper {
  width: 70%;
}
.btn-signup {
  display: flex;
  margin: 1vw auto 0 auto;
  width: 80%;
}
</style>