<template>
  <section class="section section--intro">
    <div class="intro__text">
      <h1>Want to check what do they know about you?</h1>
      <p>We all leave information about ourselves on the internet, with every google search and every message or email we send.</p>
      <p>But which kind of insights do big tech companies have available about us?</p>
      <action-button
        text="Show me my insights!"
        @action-clicked="$emit('click-in-show')"
      />
    </div>
    <img class="intro__video" src="~/assets/summary.gif"/>
  </section>
</template>

<script>
import ActionButton from '../atoms/ActionButton.vue'

export default {
  name: 'ProjectIntroduction',
  components: {
    ActionButton
  },
}
</script>

<style scoped>
.section--intro {
  background: linear-gradient(#7c4eff,#5aa4ba);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.intro__text {
  min-width: 400px;
  width: 50%;
  margin: 2rem;
}
.intro__video {
  min-width: 200px;
  width: 20%;
  margin: 2rem;
}
</style>