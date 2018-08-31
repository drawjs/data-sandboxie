<template>
  <section class="normalButton" :style="{ color, border: `1px solid ${ background }`, cursor }">
    <slot></slot>
  </section>
</template>

<script>
 export default {
   name: 'NormalButton',
   props: {
     value: {
      type: String,
      default: 'Button',
     },
     textColor: {
       type: String,
       default:  '#fff'
     },
     bgColor: {
       type: String,
       default:  'rgba(84,188,197,0.80)'
     },
     disabled: {
       type: Boolean,
       default: false
     }
   },

   data() {
     return {
       disabledTextColor: '#526375',
       disabledBgColor: '#333E4F',
     }
   },
   computed: {
     color() {
       const { disabled, disabledTextColor, textColor } = this
       return disabled ? disabledTextColor : textColor
     },
     background() {
       const { disabled, disabledBgColor, bgColor } = this
       return disabled ? disabledBgColor : bgColor
     },
     cursor() {
       const { disabled } = this
       return disabled ? 'normal' : 'pointer'
     },
   }
 }
</script>
a
<style scoped>
section.normalButton {
  display: inline-flex;
  padding: 5px 15px;
  border-radius: 100px;
  font-size: 14px;
  text-align: center;
  font-size:14px;
}
</style>
