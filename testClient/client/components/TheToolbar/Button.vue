<template>
  <NormalButton class="Button" :disabled="disabled">
    <slot></slot>
  </NormalButton>
</template>

<script>
import NormalButton from '../shared/Button/NormalButton'
import { mapState } from 'vuex'

export default {
  name: 'Button',
  props: [ 'disabled' ],
  components: {
    NormalButton
  },
  computed: {
  }
}
</script>

<style scoped>
.Button {
  margin: 5px 0;
}
</style>
