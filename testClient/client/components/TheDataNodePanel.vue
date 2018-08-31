<template>
  <Panel >
    <div v-show="title">名称: {{title}}</div>
  </Panel>
</template>

<script>
import Panel from './Panel.vue'
export default {
  name: 'TheDataNodePanel',
  components: {
    Panel
  },
  props: {
    dataNodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    title() {
      try {
        return this.dataNodeInfo.titleText.text
      } catch(e) {}
    }
  }
}
</script>

<style>

</style>
