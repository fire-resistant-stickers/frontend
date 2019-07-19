<template>
  <div id="graphRoot">
    <div id="liner"></div>
    <div id="graph"></div>
    <v-bottom-sheet v-model="sheet" class="sheet">
      <v-list two-line style="padding-top:0; border-radius: 20px;">
        <v-layout
          align-center
          justify-center
          style="box-shadow: 0 2px 2px rgba(0,0,0,0.15); border-radius: 10px 10px 0 0"
        >
          <v-flex xs1></v-flex>
          <v-flex xs10>
            <h2>{{ docName }}</h2>
          </v-flex>
          <v-flex xs1>
            <v-btn fab flat @click="sheet = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout v-for="item in items" :key="item.title" @click="sheet = false">
          <v-subheader v-if="item.legend" :key="item.legend">{{ item.legend }}</v-subheader>
          <v-flex v-else>
            <v-list-tile row>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-layout column align-end v-if="item.read">
                <v-icon color="#09c06e">check</v-icon>
                <div>{{ item.read }}전 읽음</div>
              </v-layout>
            </v-list-tile>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    sheet: true,
    docName: "C++로의 소개",
    items: [
      {
        legend: "큐레이터 추천"
      },
      {
        title: "Introduction to C++",
        subtitle: "YouTube 동영상",
        read: "3일"
      },
      {
        title: "C에서 C++으로의 트랜지션, 그리고 비교",
        subtitle: "YouTube 동영상",
        read: false
      },
      {
        legend: "StuFlow 자동 추천"
      },
      {
        title: "The Basics of C++",
        subtitle: "PDF 문서",
        read: false
      }
    ],
    data: [
      {
        name: "0",
        rank: 0,
        link: [1]
      },
      {
        name: "1",
        rank: 1,
        link: []
      }
    ]
  }),
  mounted() {
    var graph = document.getElementById("graph");
    var liner = SVG("liner");
    var data = this.data;

    addEventListener("resize", e => {
      resizeing();
    });
    function resizeing() {
      var l = document.getElementById("liner");
      l.style.width = graph.clientWidth + "px";
      l.style.height = graph.clientHeight + "px";
    }
    function render() {
      graph.innerHTML = "";
      liner.clear();

      var maxLevel = 0;
      data.forEach((x, idx) => {
        data[idx].index = idx;
        if (x.rank > maxLevel) maxLevel = x.rank;
      });
      var levels = [];
      var startRGB = [76, 175, 80];
      var endRGB = [233, 30, 99];
      var gapRGB = [
        endRGB[0] - startRGB[0],
        endRGB[1] - startRGB[1],
        endRGB[2] - startRGB[2]
      ];
      var getRGB = idx => {
        return `${startRGB[0] + (gapRGB[0] / maxLevel) * idx},${startRGB[1] +
          (gapRGB[1] / maxLevel) * idx},${startRGB[2] +
          (gapRGB[2] / maxLevel) * idx}`;
      };
      for (let i = 0; i <= maxLevel; i++) {
        var level = document.createElement("div");
        var levelText = document.createElement("div");

        level.classList.add("level");
        level.style.borderBottom = `1px solid rgba(${getRGB(i)},0.2)`;
        level.style.color = `rgb(${getRGB(i)})`;
        level.style.position = "relative";

        levelText.innerText = i + 1;
        levelText.classList.add("levelText");
        level.appendChild(levelText);

        graph.appendChild(level);
        levels.push(level);
      } // 모든 레벨 추가하기

      data.forEach((item, index) => {
        var div = document.createElement("div");
        var circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.border = `2px solid rgb(${getRGB(item.rank)})`;
        div.classList.add("item");
        div.appendChild(circle);
        div.appendChild(document.createTextNode(item.name));
        levels[item.rank].appendChild(div);
        data[index].prop = div;
        div.controllter = item;
      }); // 모든 요소 추가하기

      data.forEach((item, index) => {
        item.link.forEach(link => {
          var prevProp = item.prop;
          var nextProp = data[link].prop;
          if (item.rank == data[link].rank) {
            if (prevProp.parentElement.classList.contains("level")) {
              var group = document.createElement("div");
              var tmp = prevProp.parentElement;
              group.classList.add("columnGroup");
              prevProp.parentElement.removeChild(prevProp);
              nextProp.parentElement.removeChild(nextProp);
              group.appendChild(prevProp);
              group.appendChild(nextProp);
              levels[item.rank].appendChild(group);
            } else {
              var tmp = prevProp.parentElement;
              while (!tmp.parentElement.classList.contains("level")) {
                tmp = prevProp.parentElement;
              }
              nextProp.parentElement.removeChild(nextProp);
              tmp.appendChild(nextProp);
            }
          }
        });
      }); // 같은 등급 그룹 설정해주기

      var maxColumnWidth = [];
      data.forEach(item => {
        var index;
        var child;
        var parent = item.prop.parentElement;
        var child = item.prop;
        if (parent.classList.contains("columnGroup")) {
          child = parent;
          parent = parent.parentElement;
        }
        [...parent.children].forEach((x, idx) => {
          if (x == child) {
            index = idx;
          }
        });
        item.column = index;
        if (
          item.prop.offsetWidth >
          (maxColumnWidth[index] || !maxColumnWidth[index])
        )
          maxColumnWidth[index] = item.prop.offsetWidth;
      });

      data.forEach((item, index) => {
        item.prop.style.width = maxColumnWidth[item.column] + "px";
      });

      data.forEach((item, index) => {
        item.link.forEach(link => {
          var prevProp = item.prop.children[0];
          var nextProp = data[link].prop.children[0];
          var prev = prevProp.getBoundingClientRect();
          var next = nextProp.getBoundingClientRect();
          var prevPointX = scrollX + prev.left + prevProp.offsetWidth / 2;
          var prevPointY = scrollY + prev.top + prevProp.offsetHeight;
          var nextPointX = scrollX + next.left + nextProp.offsetWidth / 2;
          var nextPointY = scrollY + next.top;
          liner
            .line(prevPointX, prevPointY, nextPointX, nextPointY)
            .stroke({ width: 1 });
        });
      });
    }
    render();
    resizeing();
  }
};
</script>

<style>
#graphRoot {
  min-width: 700px;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  position: relative;
  background: white;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

#graph {
  position: absolute;

  display: flex;
  flex-direction: column;
}

#liner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.level {
  display: flex;
  justify-content: center;
}

.level > .levelText {
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  font-size: 2em;
}

.item {
  height: fit-content;
  display: flex;
  align-items: center;
  margin: 30px;
  padding: 20px;
}

.item > .circle {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  margin-right: 10px;
  background-color: #dddddd;
}

.columnGroup {
  width: fit-content;
  display: flex;
  flex-direction: column;
}

.sheet {
  border-radius: 10px;
}
</style>