<template>
  <div class="trisGame">
    <tris-grid ref="myGrid" width="300px" height="600px" />
  </div>
</template>

<script>
/* eslint-disable */

import TrisGrid from '@/components/TrisGrid'
import TrisEngine from '@/TrisEngine'

const NO_OF_ROWS = 20;
const NO_OF_COLUMNS = 10;

let myTrisEngine = new TrisEngine(NO_OF_COLUMNS, NO_OF_ROWS);

export default {
  name: 'TrisGame',
  mounted: function() {
    this.trisGrid = this.$refs.myGrid;
    this.trisGrid.setDimensions(NO_OF_COLUMNS, NO_OF_ROWS);
    this.updateGrid(myTrisEngine.getProperty("/board"));
    myTrisEngine.subscribe("boardChanged", this.onGameEvent, this);
    myTrisEngine.startGame();
    document.addEventListener("keydown", this.onKeyPressed.bind(this), false);
  },
  methods: {
    updateGrid: function(oBoard) {
      let aGrid = oBoard.rows.map(function (oRow) {
        return oRow.columns.map(function (oColumn) {
          return { class: "trisGridFieldType" + oColumn.type };
        });
      })
      this.trisGrid.grid = aGrid;
    },
    onGameEvent: function(oEvent) {
      this.updateGrid(oEvent.board);
    },
    onKeyPressed: function(e) {
      e = e || window.event;

      if (e.keyCode == '38') {
          myTrisEngine.blockRotateLeft();
      }
      else if (e.keyCode == '40') {
          myTrisEngine.blockDown();
      }
      else if (e.keyCode == '37') {
          myTrisEngine.blockLeft();
      }
      else if (e.keyCode == '39') {
          myTrisEngine.blockRight();
      }
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
}

</style>
