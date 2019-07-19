<template>
  <v-layout class="login-holder">
    <v-flex class="login-box" elevation-4 xs10 md7 lg5>
      <v-form ref="form" v-model="valid" class="login-box-wrapper">
        <h1>StuFlo에 로그인</h1>
        <v-text-field
          v-model="email"
          type="email"
          label="E-mail"
          :rules="emailRules"
          @keyup.enter="login"
          single-line
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          label="비밀번호"
          :rules="pwRules"
          @keyup.enter="login"
          single-line
          required
        ></v-text-field>
        <v-btn color="#3F68E4" class="white--text btn-login" round>로그인</v-btn>
        <v-btn color="#3F68E4" class="btn-signup" @click="$router.push('/signup')" flat>계정 만들기</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      v => !!v || "필수 항목입니다.",
      v => /.+@.+/.test(v) || "유효한 E-mail을 입력하여 주십시오"
    ],
    password: "",
    pwRules: [
      v => !!v || "필수 항목입니다.",
      v => (v && v.length > 4) || "비밀번호를 4자 이상 입력하십시오."
    ]
  }),
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$router.push("/");
      }
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
.login-holder {
  height: 100vh;
}
.login-box {
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
.login-box-wrapper {
  width: 70%;
}
.btn-login {
  display: flex;
  margin: 3vw auto 0 auto;
  width: 80%;
}
</style>