<template>
  <full-page ref="fullpage">
    <section class="section section--emojis">
      <h1>Emojis</h1>
      {{ emojis }}
    </section>
  </full-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',

  computed: {
    ...mapGetters('analysis', ['emojis'])
  }
}
</script>

<style scoped>
.section--emojis {
  background: linear-gradient(#001122,#000000);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>