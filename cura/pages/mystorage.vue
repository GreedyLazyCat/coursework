<script setup lang="ts">
function filesDropped(files: FileList){
    console.log(files)
}
</script>

<template>
    
    <DragNDropArea @files-dropped="filesDropped">
        <CuraNav>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
            <CuraNavItem to="/home"> test</CuraNavItem>
        </CuraNav>
</DragNDropArea>
</template>