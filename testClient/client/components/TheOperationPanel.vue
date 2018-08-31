<template>
  <Panel>
    <div v-for="(title, index) in titles" :key="index">
      节点: {{ title }}
    </div>
    <div >
      <button @click="onGenerateResultButtonClick">生成结果</button>
    </div>
  </Panel>
</template>

<script>
import Panel from './Panel.vue'
export default {
  name: 'TheOperationPanel',
  components: {
    Panel
  },
  props: {
    operationInfo: {
      type: Object,
      default: () => {}
    },
    onGenerateResultClick: {
      type: Function
    }
  },
  computed: {
    titles() {
      try {
        return this.operationInfo.nodes.map( node => node.titleText.text )
      } catch(e) {}
    },
  },
  methods: {
    onGenerateResultButtonClick() {
      this.onGenerateResultClick && this.onGenerateResultClick( this.operationInfo )
    }
  }
}
</script>

<style>
</style>
