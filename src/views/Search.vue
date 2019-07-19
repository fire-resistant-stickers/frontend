<template>
  <v-layout class="search-holder">
    <v-flex class="search-box" elevation-4 xs10 md7 lg5>
      <div class="search-box-wrapper">
        <v-layout>
          <v-text-field v-model="search" label="검색" single-line></v-text-field>
          <v-btn fab flat small>
            <v-icon>search</v-icon>
          </v-btn>
        </v-layout>
        <v-list two-line dense>
          <template v-for="(item, index) in items">
            <v-list-tile :key="item.topic" class="li" @click>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.topic"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.category"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-btn round>
          <v-layout>
            <v-icon>add_circle</v-icon>
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
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
</style>