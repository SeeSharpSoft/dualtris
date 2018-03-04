<template>
  <div ref="myGrid" class="trisGrid" :style="gridStyle">
    <div class="trisGridRow" v-for="(row, rowIndex) in grid" :key="rowIndex">
      <div class="trisGridField" :class="field.class" :style="field.style" v-for="(field, columnIndex) in row" :key="columnIndex" :row-index="rowIndex" :column-index="columnIndex">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'TrisGrid',
  mounted: function () {
    this._generateGrid();
  },
  data() {
   return {
      sizeX: 10,
      sizeY: 20,
      grid: [[]]
    }
  },
  props: ["width", "height"],
  computed: {
    gridStyle: function() {
      return {
        width: this.width || "100%",
        height: this.height || "100%"
      }
    }
  },
  methods: {
    setDimensions: function(iX, iY) {
      this.sizeX = iX;
      this.sizeY = iY;
      this._generateGrid();
    },
    _generateGrid: function() {
      this.grid = [];
      for (var y = 0; y < this.sizeY; ++y) {
        var aRow = [];
        this.grid.push(aRow);
        for (var x = 0; x < this.sizeX; ++x) {
          var oColumn = {
          };
          aRow.push(oColumn);
        }
      }
    }
  }
}
</script>

<style>

.trisGrid {
  display: flex;
  flex-direction: column;
  margin: auto;
  font-size: small;
}

.trisGridRow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.trisGridField {
  width: 100%;
  height: 100%;
  display: inline-block;
  outline: 0.1px solid lightgrey;
  border-radius: 5px;
  background: white;
}

.trisGridFieldType0 {
  background-color: white;
}

.trisGridFieldTypeI {
  background-color: red;
}

.trisGridFieldTypeO {
  background-color: green;
}

.trisGridFieldTypeT {
  background-color: purple;
}

.trisGridFieldTypeJ {
  background-color: blue;
}

.trisGridFieldTypeL {
  background-color: orange;
}

.trisGridFieldTypeS {
  background-color: yellow;
}

.trisGridFieldTypeZ {
  background-color: aqua;
}

</style>
