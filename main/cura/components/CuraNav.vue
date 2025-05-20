<template>
    <nav class="cura-nav">
        <ul>
           <slot></slot> 
        </ul>
    </nav>
</template>

<style>
.cura-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 16px;
}


</style>