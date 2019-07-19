<template>
    <v-layout class="console-holder">
        <v-flex class="console-box" elevation-4>
            <v-flex xs6 class="vl px-4 pt-2">
                <v-layout align-start column fill-height>
                    <v-layout align-center>
                        <v-text-field v-model="docName" label="문서 이름" single-line></v-text-field>
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
                    <div
                        id="main"
                        class="pa-2"
                        style="height: 100%; width:100%; overflow:scroll;position:relative;"
                    >
                        <div id="liner"></div>
                        <div id="graph"></div>
                    </div>
                </v-layout>
            </v-flex>
            <!-- 좌우 구분  -->
            <v-flex class="pa-4" xs6>
                <h2>노드 정보 수정 ({{(currentDataIndex) != -1 ? data[currentDataIndex].name : ''}})</h2>
                <div v-if="currentDataIndex == -1">
                    <v-text-field v-model="node" label="노드 이름"></v-text-field>
                    <v-text-field v-model="rating" label="레이팅" type="number" min="1" max="9"></v-text-field>
                </div>
                <div v-else>
                    <v-text-field
                        v-model="data[currentDataIndex].name"
                        label="노드 이름"
                        @change="render"
                    ></v-text-field>
                    <v-text-field
                        v-model="data[currentDataIndex].rank"
                        label="레이팅"
                        type="number"
                        min="1"
                        max="9"
                        @change="render"
                    ></v-text-field>
                </div>

                <h2>큐레이터 추천 자료 입력</h2>
                <v-layout
                    row
                    v-for="(i,idx) in currentDataIndex != -1 ? data[currentDataIndex].recommend : tmpQuData"
                    :key="idx"
                >
                    <v-flex xs6 class="mr-2">
                        <v-text-field v-model="i.title" label="제목"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="ml-3">
                        <v-layout for>
                            <v-text-field v-model="i.url" label="URL"></v-text-field>
                            <v-btn fab flat small color="red" @click="quDel(idx)">삭제</v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-flex text-xs-right>
                    <v-btn flat color="#3b6ce4" class="font-weight-bold" @click="quAdd">자료 추가</v-btn>
                </v-flex>
                <v-flex text-xs-right>
                    <v-btn
                        flat
                        color="#3b6ce4"
                        class="font-weight-bold"
                        @click="appendData()"
                        v-if="currentDataIndex == -1"
                    >노드 추가</v-btn>
                </v-flex>
                <v-spacer></v-spacer>
                <v-layout align-end justify-end>
                    <v-btn flat color="#3b6ce4" class="font-weight-bold" @click="save">저장 및 업로드</v-btn>
                </v-layout>
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        docName: "C++",
        node: "",
        rating: 1,
        parent: "",
        title: "",
        url: "",
        data: [],

        graph: null,
        main: null,
        liner: null,

        currentDataIndex: -1,
        tmpQuData: [{ title: "", url: "" }]
    }),
    mounted() {
        var graph = document.getElementById("graph");
        var main = document.getElementById("main");
        var liner = SVG("liner");
        this.graph = graph;
        this.main = main;
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
        main.addEventListener("mousedown", e => {
            if (e.target.classList.contains("item")) {
                startItem = e.target;
                this.currentDataIndex = startItem.controllter.index;
                startPoint[0] =
                    scrollX +
                    startItem.children[0].getBoundingClientRect().left +
                    startItem.children[0].offsetWidth / 2 -
                    main.getBoundingClientRect().left +
                    main.scrollLeft;
                startPoint[1] =
                    scrollY +
                    startItem.children[0].getBoundingClientRect().top +
                    startItem.children[0].offsetHeight -
                    main.getBoundingClientRect().top +
                    main.scrollTop;
                currentLine = liner
                    .line(e.clientX, e.clientY, e.clientX, e.clientY)
                    .stroke({ width: 1 });
            } else {
                this.currentDataIndex = -1;
            }
        });
        main.addEventListener("mousemove", e => {
            if (currentLine)
                currentLine.plot(
                    startPoint[0],
                    startPoint[1],
                    scrollX +
                        e.clientX -
                        main.getBoundingClientRect().left +
                        main.scrollLeft,
                    scrollY +
                        e.clientY -
                        main.getBoundingClientRect().top +
                        main.scrollTop
                );
        });
        main.addEventListener("mouseup", e => {
            if (currentLine) {
                currentLine.plot(
                    startPoint[0],
                    startPoint[1],
                    scrollX +
                        e.clientX -
                        main.getBoundingClientRect().left +
                        main.scrollLeft,
                    scrollY +
                        e.clientY -
                        main.getBoundingClientRect().top +
                        main.scrollTop
                );
                currentLine.remove();
                currentLine = null;
                if (e.target.classList.contains("item")) {
                    var target = e.target;
                    if (
                        startItem.controllter.index !=
                            target.controllter.index &&
                        data[startItem.controllter.index].link.indexOf(
                            target.controllter.index
                        ) == -1 &&
                        data[startItem.controllter.index].rank <=
                            target.controllter.rank
                    ) {
                        data[startItem.controllter.index].link.push(
                            target.controllter.index
                        );
                    }
                    this.render();
                }
            }
        });
    },
    methods: {
        resizeing() {
            var l = document.getElementById("liner");
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

                div.addEventListener("dblclick", e => {
                    this.data[index].link = [];
                    this.render();
                });

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
                    var prevPointX =
                        prev.left +
                        prevProp.offsetWidth / 2 -
                        main.getBoundingClientRect().left +
                        main.scrollLeft;
                    var prevPointY =
                        prev.top +
                        prevProp.offsetHeight -
                        main.getBoundingClientRect().top +
                        main.scrollTop;
                    var nextPointX =
                        next.left +
                        nextProp.offsetWidth / 2 -
                        main.getBoundingClientRect().left +
                        main.scrollLeft;
                    var nextPointY =
                        next.top -
                        main.getBoundingClientRect().top +
                        main.scrollTop;
                    this.liner
                        .line(prevPointX, prevPointY, nextPointX, nextPointY)
                        .stroke({ width: 1 });
                });
            });
            this.resizeing();
        },
        appendData() {
            this.data.push({
                name: this.node,
                rank: this.rating,
                link: [],
                recommend: this.tmpQuData
            });
            this.render();
            this.node = "";
            this.tmpQuData = [{ title: "", url: "" }];
        },
        quAdd() {
            if (this.currentDataIndex != -1)
                this.data[this.currentDataIndex].recommend.push({
                    title: "",
                    url: ""
                });
            else this.tmpQuData.push({ title: "", url: "" });
        },
        quDel(idx) {
            if (this.currentDataIndex != -1)
                this.data[this.currentDataIndex].recommend.splice(idx, 1);
            else this.tmpQuData.splice(idx, 1);
        },
        save() {
            var tmp = {
                title: this.docName,
                category: "컴퓨터",
                nodeData: this.data.map(x => {
                    x.prop = null;
                    return x;
                })
            };
            axios
                .post(
                    this.$store.state.mainPath + "/console/changeConsole",
                    tmp,
                    {
                        headers: {
                            Authorization: this.getToken
                        }
                    }
                )
                .then(data => {
                });
        }
    },
    computed: {
        getToken() {
            return this.$store.state.token;
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
.console-holder {
    height: 100vh;
    align-items: center;
    justify-content: center;
}
.console-box {
    display: flex;
    margin: 2%;
    width: 90vw;
    height: 80vh;
    background: white;
    border-radius: 10px;
    color: #222;
}
.vl {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

#graph {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;

    display: flex;

    flex-direction: column;
}

#liner {
    position: absolute;
    top: 0;
    left: 0;
}

.level {
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
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
    flex-wrap: nowrap;
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