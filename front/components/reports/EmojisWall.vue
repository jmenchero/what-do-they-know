<template>
  <section class="section section--emojis">
    <h1>Your emojis wall</h1>
    <div
      v-for="(count, emoji) in emojisWall"
      :key="emoji"
      :style="emojiStyle(count)"
    >
      {{ emoji }}
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'


export default {
  name: 'EmojisWall',
  computed: {
    ...mapState('analysis', [
      'emojisWall',
    ]),
  },
  methods: {
    emojiStyle(count) {
      return `
        position: absolute;
        font-size: ${count*2}px;
        left: calc(${Math.floor(Math.random()*100)}vw - ${count*2}px);
        top: calc(${Math.floor(Math.random()*100)}vh - ${count*2}px);
        transform: translatey(0px);
        animation: float ${Math.random()*10+5}s ease-in-out;
      `
    }
  }
}
</script>

<style>
.section--emojis {
  background: linear-gradient(#001122,grey);
  display: flex;
  justify-content: center;
}
.section--emojis h1 {
  z-index: 10;
}

@keyframes float {
	0% {
		transform: translatey(100vh);
	}
	100% {
		transform: translatey(0vh);
	}
}
</style>