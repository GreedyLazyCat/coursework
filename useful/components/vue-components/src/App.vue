<script setup>
import DragNDropArea from './components/DragNDropArea.vue';

</script>
<template>
  <div class="main">
    asdjlsdljasldjalsdjlj
    <DragNDropArea></DragNDropArea>
  </div>
</template>

<style>
.main{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  outline: 1px solid red;
  background-color: var(--md-sys-color-surface);
}
</style>