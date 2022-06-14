<template>
  <section class="section section--global">
    <div class="global-report">
      <h1>You vs World</h1>
      <div v-if="!globalAnalysis" class="global-report__content">
        <p>If you want to check how your data compares to others you should allow us to process some of your data on our servers, but don't worry, none of your messages are shared, and everything will be anonymous.</p>
        <p>This is the only data you would be sharing with us:</p>
        <p class="strong">Anual Messages: {{ anualMessages }} messages</p>
        <p class="strong">Average Message Length: {{ averageLength }} characters</p>
        <b-button
          class="intro__button"
          type="is-primary"
          icon-left="upload"
          rounded
          @click="processGlobalAnalysis"
        >Agree and unlock the report!</b-button>
      </div>
      <div v-else class="global-report__content">
        <p class="strong">Anual Messages: {{ anualMessages }} vs {{ globalAnalysis.anualMessages.avg.longValue }}</p>
        <p class="strong">Average Message Length: {{ averageLength }} vs {{ globalAnalysis.messageLength.avg.longValue }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'


export default {
  name: 'GlobalReport',
  computed: {
    ...mapState('analysis', [
      'anualMessages',
      'averageLength',
      'globalAnalysis'
    ]),
  },
  methods: {
    ...mapActions('analysis', ['dumpAnonymizedData', 'fetchGlobalData']),
    processGlobalAnalysis () {
      this.dumpAnonymizedData()
      this.fetchGlobalData()
    },
  }
}
</script>

<style>
.section--global {
  background: linear-gradient(grey,#001122);
}

.global-report {
  margin: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.global-report p{
  font-size: 1vw;
  opacity: .8;
}

.global-report p.strong{
  font-size: 1.2vw;
  opacity: 1;
  margin-left: 2rem;
}

.global-report__content {
  margin: 2rem;
}
</style>