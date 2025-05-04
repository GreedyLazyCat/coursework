<script setup lang="ts">

</script>

<template>
    <div class="cura-file-info-tab">
        <span class="cura-file-info__name"></span>
        <span class="cura-file-info__path"></span>
    </div>
</template>

<style>
.cura-file-info-tab {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    width: 350px;
    height: 100%;
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    z-index: 200;
    border-left: 1px solid var(--md-sys-color-outline-variant);
}
</style>

