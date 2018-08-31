<template>
  <Panel >
    <div v-show="title">名称: {{title}}</div>
  </Panel>
</template>

<script>
import Panel from './Panel.vue'
export default {
  name: 'TheResultNodePanel',
  components: {
    Panel
  },
  props: {
    resultNodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    title() {
      try {
        return this.resultNodeInfo.titleText.text
      } catch(e) {}
    }
  }
}
</script>

<style>

</style>
