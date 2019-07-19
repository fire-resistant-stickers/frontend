<template>
    <div id="graphRoot">
        <div id="liner2"></div>
        <div id="graph"></div>
        <v-bottom-sheet :value="currentIndex != -1 && getData">
            <v-list>
                <v-subheader>Open in</v-subheader>
                <v-list-tile v-for="item in buffer" :key="item.title">
                  <a :href="item.url" target="_blink">{{item.title}}</a>
                </v-list-tile>
            </v-list>
        </v-bottom-sheet>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data: () => ({
        data: [],

        graph: null,
        main: null,
        liner: null,

        buffer : [],
        currentIndex: -1
    }),
    mounted() {
        if (this.getCurrentDataIndex == -1) {
            this.$router.push("/search");
        } else {
            this.data = this.getData[this.getCurrentDataIndex].nodeData;
        }
        var graph = document.getElementById("graph");
        var liner = SVG("liner2");
        this.graph = graph;
        this.liner = liner;

        addEventListener("resize", e => {
            this.render();
        });
        var data = this.data;
        this.render();
        var currentLine;
        var startItem;
        var startPoint = [];
        var endPoint = [];
        addEventListener("mousedown", e => {
            if (e.target.classList.contains("item")) {
                startItem = e.target;
                this.currentIndex = startItem.controllter.index;
                if(this.data[this.currentIndex]){
                  this.buffer = this.data[this.currentIndex].recommend
                }
            } else {
                this.currentIndex = -1;
            }
        });
        addEventListener("mouseup",e=>{
          this.currentIndex = -1;
        })
    },
    methods: {
        resizeing() {
            var l = document.getElementById("liner2");
            l.style.width = this.graph.clientWidth + "px";
            l.style.height = this.graph.clientHeight + "px";
        },
        render() {
            this.graph.innerHTML = "";
            this.liner.clear();

            var maxLevel = 0;
            this.data.forEach((x, idx) => {
                this.data[idx].index = idx;
                if (x.rank - 1 > maxLevel) maxLevel = x.rank - 1;
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
                return `${startRGB[0] +
                    (gapRGB[0] / maxLevel) * idx},${startRGB[1] +
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

            this.data.forEach((item, index) => {
                var div = document.createElement("div");
                var circle = document.createElement("div");
                circle.classList.add("circle");
                circle.style.border = `2px solid rgb(${getRGB(item.rank - 1)})`;
                div.classList.add("item");
                div.appendChild(circle);
                div.appendChild(document.createTextNode(item.name));

                levels[item.rank - 1].appendChild(div);

                this.data[index].prop = div;
                div.controllter = item;
            }); // 모든 요소 추가하기

            this.data.forEach((item, index) => {
                item.link.forEach(link => {
                    var prevProp = item.prop;
                    var nextProp = this.data[link].prop;
                    if (item.rank == this.data[link].rank) {
                        if (
                            prevProp.parentElement.classList.contains("level")
                        ) {
                            var group = document.createElement("div");
                            var tmp = prevProp.parentElement;
                            group.classList.add("columnGroup");
                            prevProp.parentElement.removeChild(prevProp);
                            nextProp.parentElement.removeChild(nextProp);
                            group.appendChild(prevProp);
                            group.appendChild(nextProp);
                            levels[item.rank - 1].appendChild(group);
                        } else {
                            var tmp = prevProp.parentElement;
                            while (
                                !tmp.parentElement.classList.contains("level")
                            ) {
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

            this.data.forEach((item, index) => {
                item.link.forEach(link => {
                    var prevProp = item.prop.children[0];
                    var nextProp = this.data[link].prop.children[0];
                    var prev = prevProp.getBoundingClientRect();
                    var next = nextProp.getBoundingClientRect();
                    var prevPointX = prev.left + prevProp.offsetWidth / 2;
                    var prevPointY = prev.top + prevProp.offsetHeight;
                    var nextPointX = next.left + nextProp.offsetWidth / 2;
                    var nextPointY = next.top;
                    this.liner
                        .line(prevPointX, prevPointY, nextPointX, nextPointY)
                        .stroke({ width: 1 });
                });
            });
            this.resizeing();
        }
    },
    computed: {
        getToken() {
            return this.$store.state.token;
        }
    },
    computed: {
        getCurrentDataIndex() {
            return this.$store.state.currentDataIndex;
        },
        getData() {
            return this.$store.state.data;
        }
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
</style>