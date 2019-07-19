<template>
  <v-layout class="console-holder">
    <v-flex class="console-box" elevation-4>
      <v-flex xs6 class="vl">
        <v-layout align-start column fill-height>
          <v-layout align-center>
            <h2>C++</h2>
            <v-btn fab flat small>
              <v-icon>edit</v-icon>
            </v-btn>
          </v-layout>
          <v-layout align-center>
            <p>컴퓨터 과학 > 프로그래밍 언어</p>
            <v-btn fab flat small>
              <v-icon>arrow_drop_down</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </v-flex>
      <!-- 구분  -->
      <v-text-field xs6>
        <h2>노드 정보 수정</h2>
        <v-text-field v-model="node" label="노드 이름"></v-text-field>
        <v-flex>
          <v-text-field v-model="rating" label="레이팅"></v-text-field>
        </v-flex>
        <v-text-field>
          <v-text-field v-model="parent" label="상위 노드"></v-text-field>
        </v-text-field>

        <h2>큐레이터 추천 자료 입력</h2>
        <v-flex>
          <v-text-field v-model="title" label="제목"></v-text-field>
        </v-flex>
        <v-flex>
          <v-layout>
            <v-text-field v-model="url" label="URL"></v-text-field>
            <v-btn fab flat small>
              <v-icon>remove</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
      node: "",
      rating: 0,
      parent: "",
      title: "",
      url: "",
    data: [
      {
        name: "0",
        rank: 0,
        link: [1]
      },
      {
        name: "1",
        rank: 1,
        link: [2, 3]
      },
      {
        name: "2",
        rank: 1,
        link: [4, 5, 6, 7]
      },
      {
        name: "3",
        rank: 2,
        link: [11]
      },
      {
        name: "4",
        rank: 2,
        link: [11]
      },
      {
        name: "5",
        rank: 2,
        link: [11]
      },
      {
        name: "6",
        rank: 2,
        link: [11]
      },
      {
        name: "7",
        rank: 2,
        link: [8]
      },
      {
        name: "8",
        rank: 2,
        link: [9]
      },
      {
        name: "9",
        rank: 2,
        link: [10]
      },
      {
        name: "10",
        rank: 2,
        link: [11]
      },
      {
        name: "11",
        rank: 3,
        link: []
      }
    ]
    //
  }),
  mounted() {
    var graph = document.getElementById("graph");
    var liner = SVG("liner");

    addEventListener("resize", e => {
      drawLine();
      resizeing();
    });
    var levels = [];
    var level_holders = [];
    function resizeing() {
      var l = document.getElementById("liner");
      l.style.width = graph.clientWidth + "px";
      l.style.height = graph.clientHeight + "px";
      level_holders.forEach(x => x.scrollTo(innerWidth / 2, 0));
    }
    function render() {
      graph.innerHTML = "";

      var maxLevel = 0;
      this.data.forEach((x, idx) => {
        this.data[idx].index = idx;
        if (x.rank > maxLevel) maxLevel = x.rank;
      });

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
        var level_holder = document.createElement("div");
        var levelText = document.createElement("div");

        level.classList.add("level");
        level.style.borderBottom = `1px solid rgba(${getRGB(i)},0.2)`;
        level.style.color = `rgb(${getRGB(i)})`;
        level.style.background = `rgba(${getRGB(i)},0.1)`;

        level_holder.classList.add("level_holder");
        level_holder.appendChild(level);

        levelText.innerText = i + 1;
        levelText.classList.add("levelText");
        level.appendChild(levelText);
        level_holder.addEventListener("scroll", e => {
          for (let j = i; j <= maxLevel; j++) {
            level_holders[j].scrollTo(e.target.scrollLeft, 0);
          }
          drawLine();
        });

        graph.appendChild(level_holder);
        levels.push(level);
        level_holders.push(level_holder);
      } // 모든 레벨 추가하기

      this.data.forEach((item, index) => {
        var div = document.createElement("div");
        var circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.border = `2px solid rgb(${getRGB(item.rank)})`;
        div.classList.add("item");
        div.appendChild(circle);
        div.appendChild(document.createTextNode(item.name));
        levels[item.rank].appendChild(div);

        div.addEventListener("contextmenu", e => {
          e.preventDefault();
          console.log(index);
          this.data[index].link = [];
          render();
          drawLine();
        });

        this.data[index].prop = div;
        div.controllter = item;
      }); // 모든 요소 추가하기

      this.data.forEach((item, index) => {
        item.link.forEach(link => {
          var prevProp = item.prop;
          var nextProp = this.data[link].prop;
          if (item.rank == this.data[link].rank) {
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
      this.data.forEach(item => {
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

      this.data.forEach((item, index) => {
        item.prop.style.width = maxColumnWidth[item.column] + "px";
      });
    }
    function drawLine() {
      liner.clear();
      this.data.forEach((item, index) => {
        item.link.forEach(link => {
          var prevProp = item.prop.children[0];
          var nextProp = this.data[link].prop.children[0];
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
    drawLine();
    resizeing();
    var currentLine;
    var startItem;
    var startPoint = [];
    var endPoint = [];
    addEventListener("mousedown", e => {
      if (e.target.classList.contains("item")) {
        startItem = e.target;
        startPoint[0] =
          scrollX +
          startItem.children[0].getBoundingClientRect().left +
          startItem.children[0].offsetWidth / 2;
        startPoint[1] =
          scrollY +
          startItem.children[0].getBoundingClientRect().top +
          startItem.children[0].offsetHeight;
        currentLine = liner
          .line(e.clientX, e.clientY, e.clientX, e.clientY)
          .stroke({ width: 1 });
      }
    });
    addEventListener("mousemove", e => {
      if (currentLine)
        currentLine.plot(
          startPoint[0],
          startPoint[1],
          scrollX + e.clientX,
          scrollY + e.clientY
        );
    });
    addEventListener("mouseup", e => {
      if (currentLine) {
        currentLine.plot(
          startPoint[0],
          startPoint[1],
          scrollX + e.clientX,
          scrollY + e.clientY
        );
        currentLine.remove();
        currentLine = null;
        if (e.target.classList.contains("item")) {
          var target = e.target;
          if (startItem.controllter.index != target.controllter.index)
            this.data[startItem.controllter.index].link.push(
              target.controllter.index
            );
          drawLine();
        }
      }
    });
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
.console-holder {
  height: 100vh;
}
.console-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 90vw;
  height: 80vh;
  background: white;
  border-radius: 10px;
  color: #222;
}
.console-box-wrapper {
  width: 70%;
}
.vl {
  border-right: 1px solid rgba(0, 0, 0, 0.15);
}
</style>