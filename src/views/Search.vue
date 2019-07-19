<template>
  <v-layout class="search-holder">
    <v-flex class="search-box" elevation-4 xs10 md7 lg5>
      <div class="search-box-wrapper">
        <v-layout>
          <v-text-field v-model="search" label="검색"></v-text-field>
          <img alt="Search" src="../assets/baseline-search-24px.svg" />
        </v-layout>
        <!-- <v-btn flat block v-for="item in items" class="li" :key="item">
          <div class="btn-content">
            <h3>{{ item.topic }}</h3>
            {{ item.category }}
          </div>
        </v-btn> -->
        <v-btn flat block>
        <v-layout class="li li-last">
          <img class="mr-2" alt="Search" src="../assets/baseline-add_circle-24px.svg" />
          <div>새 플로우 만들기...</div>
        </v-layout>
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    items: [
      { topic: "C", category: "컴퓨터 과학 > 프로그래밍 언어" },
      { topic: "C++", category: "컴퓨터 과학 > 프로그래밍 언어" },
      { topic: "C#", category: "컴퓨터 과학 > 프로그래밍 언어" },
      { topic: "Objective-C", category: "컴퓨터 과학 > 프로그래밍 언어" }
    ]
  })
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
.search-holder {
  height: 100vh;
}
.search-box {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin: auto;
  max-width: 50vw;
  height: 90vh;
  background: white;
  border-radius: 10px;
  color: #222;
}
.search-box-wrapper {
  width: 80%;
}
.li {
  display: flex;
  text-align: left;
}
/* .v-btn {
  justify-content: flex-start;
  padding: 100px;
} */
</style>