<template>
  <b-button
    class="action-button"
    type="is-primary"
    rounded
    @click="handleClick"
  >{{ text }}</b-button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: ['text'],
  methods: {
    handleClick () {
      this.$emit('action-clicked')
    }
  }
}
</script>

<style scoped>
.action-button {
  margin: 1rem;
  font-size: 1vw;
  float: right;
}
</style>



