<script setup lang="ts">
const { showModal = false} = defineProps <{
    showModal?: boolean
}>()

const emit = defineEmits<{
    clickedOutside: []
}>()
const modalRef = useTemplateRef('modalRef')

function clicked(e: MouseEvent){
    if(e.target !== modalRef.value){
        emit('clickedOutside')
    }
}

// onMounted(()=>{
    
// })

</script>
<template>
   <ClientOnly>
    <Teleport to="#modal-teleports">
       <Transition name="modal">
        <div @click="clicked"  class="cura-modal-overlay" v-if="showModal">
            <div class="cura-modal" ref="modalRef">
                <slot></slot>
            </div>
        </div>
       </Transition> 
    </Teleport>
   </ClientOnly> 
</template>

<style>
.cura-modal-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.441);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
}

.cura-modal {
    width: 200px;
    height: 200px;
    border: 1px solid var(--md-sys-color-outline-variant);
    background-color: var(--md-sys-color-surface-container);
    z-index: 250;
    border-radius: 8px;
}
.modal-leave-to,
.modal-enter-from{
    scale: 1.2;
    opacity: 0;
}

.modal-leave-active,
.modal-enter-active{
    transition: all 0.1s ease;
}


</style>