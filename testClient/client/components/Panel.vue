<template>
  <section class="panel">
    <slot />
  </section>
</template>

<script>
export default {
  name: "Panel"
}
</script>

<style>
.panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background: rgb(2, 72, 129);
}
</style>
