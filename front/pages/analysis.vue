<template>
  <full-page ref="fullpage">
    <section class="section section--emojis">
      <div 
        v-for="(count, emoji) in emojis"
        :key="emoji"
        :style="emojiStyle(count)"
      >
        {{ emoji }}
      </div>
      <h1>Your emojis wall</h1>
    </section>
  </full-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',

  computed: {
    ...mapGetters('analysis', ['emojis'])
  },

  methods: {
    emojiStyle(count) {
      return `
        position: absolute;
        font-size: ${count}px;
        left: ${Math.floor(Math.random()*100)}vw;
        top: ${Math.floor(Math.random()*100)}vh;
        transform: translatey(0px);
        animation: float ${Math.random()*10+5}s ease-in-out;
      `
    }
  }
}
</script>

<style>
.section--emojis {
  background: linear-gradient(#001122,#000000);
  display: flex;
  justify-content: center;
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