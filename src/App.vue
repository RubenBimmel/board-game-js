<template>
  <div id="app">
    <fabric-canvas />
  </div>
</template>

<script>
import FabricCanvas from "./components/FabricCanvas.vue";

export default {
  name: 'App',
  components: {
    FabricCanvas
  }
}
</script>

<style>
#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>