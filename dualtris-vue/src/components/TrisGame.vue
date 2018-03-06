<template>
  <div class="trisGame">
    <div>
      <tris-grid ref="blockGrid" height="100px" width="100px" />
      <p><b>Lines:</b> {{ lines }}</p>
      <p><b>Score:</b> {{ score }}</p>
      <button v-on:click="onPauseGame">Pause</button>
      <button v-on:click="onRestartGame">Restart</button>
    </div>
    <tris-grid ref="myGrid" width="200px" height="800px" />
  </div>
</template>

<script>
/* eslint-disable */

import TrisGrid from '@/components/TrisGrid'
import TrisEngine from '@/DualtrisEngine'

const NO_OF_ROWS = 40;
const NO_OF_COLUMNS = 10;

let myTrisEngine = new TrisEngine(NO_OF_COLUMNS, NO_OF_ROWS);

export default {
  name: 'TrisGame',
  mounted: function() {
    this.trisGrid = this.$refs.myGrid;
    this.blockGrid = this.$refs.blockGrid;

    this.trisGrid.setDimensions(NO_OF_COLUMNS, NO_OF_ROWS);
    this.blockGrid.setDimensions(4, 4);

    // this.updateGrid(myTrisEngine.getProperty("/board"));
    // this.updateBlock(myTrisEngine.getProperty("/block"));

    myTrisEngine.subscribe("propertyChanged", this.onGameEvent, this);
    myTrisEngine.startGame();
    document.addEventListener("keydown", this.onKeyPressed.bind(this), false);
  },
  beforeDestroy: function() {
    myTrisEngine.unsubscribe("propertyChanged", this.onGameEvent, this);
    document.removeEventListener("keydown", this.onKeyPressed.bind(this), false);
  },
  data: function() {
    return {
      lines: 0,
      score: 0,
      state: null
    };
  },
  methods: {
    updateBlock: function(oBlock) {
      // let aGrid = oBoard && oBoard.rows.map(function (oRow) {
      //   return oRow.columns.map(function (oColumn) {
      //     return { class: "trisGridFieldType" + oColumn.type };
      //   });
      // }) || [];
      // this.trisGrid.grid = aGrid;
    },
    updateGrid: function(oBoard) {
      let aGrid = oBoard && oBoard.rows.map(function (oRow) {
        return oRow.columns.map(function (oColumn) {
          return { class: "trisGridFieldType" + oColumn.type };
        });
      }) || [];
      this.trisGrid.grid = aGrid;
    },
    onGameEvent: function(oEvent) {
      switch (oEvent.data.property) {
        case "board":
          this.updateGrid(oEvent.data.value)
          break
        case "score":
          this.score = oEvent.data.value
          break
        case "lines":
          this.lines = oEvent.data.value
          break;
        case "state":
          this.state = oEvent.data.value
          break
        default:
          console.log("Unhandled property change: ", oEvent.data.property)
      }
    },
    onKeyPressed: function(e) {
      e = e || window.event;

      if (e.keyCode == '38') {
          myTrisEngine.getNormalTE().blockRotateLeft();
      }
      else if (e.keyCode == '40') {
          myTrisEngine.getNormalTE().blockDown();
      }
      else if (e.keyCode == '37') {
          myTrisEngine.getNormalTE().blockLeft();
      }
      else if (e.keyCode == '39') {
          myTrisEngine.getNormalTE().blockRight();
      }
      else if (e.keyCode == '83') {
          myTrisEngine.getInverseTE().blockRotateLeft();
      }
      else if (e.keyCode == '87') {
          myTrisEngine.getInverseTE().blockDown();
      }
      else if (e.keyCode == '65') {
          myTrisEngine.getInverseTE().blockLeft();
      }
      else if (e.keyCode == '68') {
          myTrisEngine.getInverseTE().blockRight();
      }
    },
    onPauseGame: function(e) {
      if (this.state === "Paused") {
        myTrisEngine.unpauseGame();
      } else if (this.state === "Running") {
        myTrisEngine.pauseGame();
      }
    },
    onRestartGame: function(e) {
      myTrisEngine.endGame();
      setTimeout(myTrisEngine.startGame.bind(myTrisEngine), 100);
    }
  },
  components: {
    TrisGrid
  }
}
</script>

<style>

.trisGame {
  width: 600px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
}



</style>
