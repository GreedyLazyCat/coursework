<script setup lang="ts">
import DragNDropArea from './components/DragNDropArea.vue';

function filesDropped(files: FileList){
  console.log(files)
}

</script>
<template>
  <div class="main">
    asdjlsdljasldjalsdjlj
    <DragNDropArea @files-dropped="filesDropped"></DragNDropArea>
  </div>
</template>

<style>
.main{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  outline: 1px solid red;
  background-color: var(--md-sys-color-surface);
}
</style>