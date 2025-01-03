<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

defineOptions({ name: 'Sudoku2' });
import { type Tip, Sudoku, getKeyName } from '../utils/sudoku';

const question = [
  [0, 0, 0, 0, 3, 0, 6, 8, 0],
  [2, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 4, 0, 0, 0, 1, 3],
  [0, 0, 0, 2, 7, 0, 0, 3, 1],
  [5, 0, 0, 9, 0, 0, 0, 0, 0],
  [3, 7, 0, 0, 0, 0, 9, 0, 0],
  [0, 9, 8, 5, 0, 0, 0, 0, 0],
  [1, 0, 2, 0, 0, 0, 4, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const sudoku = reactive(new Sudoku(question));

const infoMap = computed(() => sudoku.info);
let current = ref<Tip>({ x: -1, y: -1, z: -1, val: 0, readonly: false, options: '' });

const options = computed(() =>
  current.value.options.split('').map((item, index) => ({ readonly: item === '1', val: index + 1 }))
);

const showKeyboard = computed(() => current.value.options);

function updateCell(readonly: boolean, val: number) {
  if (!readonly) {
    console.log(`当前选中${current.value.x}-${current.value.y}`);
    sudoku.updateTip(current.value.x, current.value.y, val);
  }
}

function getCellIndex(tip: Tip) {
  console.log(tip,"tiptip");
  
console.log(options,"optionsoptions");
  if (!tip.readonly) {
    current.value = tip;
  }
}

function checkIsFocus(x: number, y: number) {
  let cell = infoMap.value[getKeyName(x, y)];

  return cell.x === current.value.x || cell.y === current.value.y || cell.z === current.value.z;
}
</script>
<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in sudoku.question" class="row" :key="`row-${rowIndex}`">
      <div
        v-for="(cell, colIndex) in row"
        class="cell"
        :class="{
          'is-readonly': infoMap[`${rowIndex}-${colIndex}`].readonly,
          'cell--focus': checkIsFocus(rowIndex, colIndex),
        }"
        :key="`cell-${rowIndex}-${colIndex}`"
        :aria-checked="current.x === rowIndex && current.y === colIndex"
        @click="getCellIndex(infoMap[`${rowIndex}-${colIndex}`])"
      >
        <div v-if="cell">{{ cell }}</div>
      </div>
    </div>
  </div>
  <div v-if="showKeyboard" class="keyboard">
    <div
      v-for="option in options"
      class="keyboard__btn"
      :class="{ 'is-exist': option.readonly }"
      :key="`key-${option.val}`"
      @click="updateCell(option.readonly, option.val)"
      >{{ option.val }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
$mainColor: rgba(0, 0, 0, 0.85);

@keyframes resetColor {
  100% {
    background-color: rgba(245, 151, 148, 0);
  }
}

.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  color: $mainColor;
}
.row {
  display: flex;
  border-bottom: 1px dashed $mainColor;
  &:first-of-type {
    border-top: 1px solid $mainColor;
  }
  &:nth-of-type(3n) {
    border-bottom-style: solid;
  }
}
.cell {
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-style: italic;
  border-right: 1px dashed $mainColor;
  &:first-child {
    border-left: 1px solid $mainColor;
  }
  &:nth-of-type(3n) {
    border-right-style: solid;
  }
  &.cell--focus {
    background-color: rgba(245, 151, 148, 0.6);
    animation: resetColor 0.2s ease-in-out reverse backwards;
  }
  &[aria-checked='true'] {
    background-color: rgba(245, 151, 148, 1);
  }
  &.is-readonly {
    font-style: normal;
    font-weight: bold;
  }
}
.keyboard {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.keyboard__btn {
  position: relative;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid $mainColor;
  border-right: none;
  &:last-of-type {
    border-right: 1px solid $mainColor;
  }
  &:hover {
    opacity: 0.8;
  }
}
.is-exist {
  color: lightgray;
}
</style>
