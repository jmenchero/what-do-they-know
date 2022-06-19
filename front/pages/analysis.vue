<template>
  <full-page ref="fullpage">
    <emojis-wall />
    <active-hours />
    <words-cloud />
    <interactions />
    <emotions />
    <favorite-contacts />
    <global-report />
  </full-page>
</template>

<script>
import EmojisWall from '../components/reports/EmojisWall.vue'
import ActiveHours from '../components/reports/ActiveHours.vue'
import WordsCloud from '../components/reports/WordsCloud.vue'
import GlobalReport from '../components/reports/GlobalReport.vue'
import Interactions from '../components/reports/Interactions.vue'
import Emotions from '../components/reports/Emotions.vue'
import FavoriteContacts from '../components/reports/FavoriteContacts.vue'


export default {
  components: {
    EmojisWall,
    ActiveHours,
    WordsCloud,
    GlobalReport,
    Interactions,
    Emotions,
    FavoriteContacts
  },
  name: 'Analysis',
}
</script>

<style>

</style>