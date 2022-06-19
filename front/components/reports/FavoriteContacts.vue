<template>
  <section class="section section--contacts">
    <h1>Your favorite contacts</h1>
    <div 
      v-for="contact in favoriteContacts"
      :key="contact.username"
      :style="contactSize(contact.count)"
    >
      {{ contact.username }}
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'


export default {
  name: 'FavoriteContacts',
  computed: {
    ...mapState('analysis', [
      'favoriteContacts'
    ])
  },
  methods: {
    contactSize (count) {
      return `font-size: ${count/200}px`
    }
  }
}
</script>

<style>
.section--contacts {
  background: linear-gradient(#001122,grey);
  display: flex;
  flex-direction: column;
}
</style>