<script setup lang="ts">

</script>

<template>
    <div class="DragNDropArea">
        <div class="DragNDropAreaCover">
            <div class="DragNDropAreaContent">
                <span>Перетащи файлы сюда, чтобы загрузить.</span> 
            </div>
        </div>
    </div>
</template>

<style>
.DragNDropArea {
    z-index: 100;
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}

.DragNDropAreaCover {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.21);
    backdrop-filter: blur(5.2px);
    -webkit-backdrop-filter: blur(5.2px);
}

.DragNDropAreaContent {
    position: absolute;
    height: 90%;
    width: 90%;
    outline: 2px dashed var(--md-sys-color-primary);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.DragNDropAreaContent span{
    color: var(--md-sys-color-primary);
    font-size: 1.2rem;
    text-align: center;
}
</style>