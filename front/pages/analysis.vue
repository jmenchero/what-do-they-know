<template>
  <full-page ref="fullpage">
    <emojis-wall />
    <active-hours />
    <words-cloud />
    <global-report />
  </full-page>
</template>

<script>
import EmojisWall from '../components/reports/EmojisWall.vue'
import ActiveHours from '../components/reports/ActiveHours.vue'
import WordsCloud from '../components/reports/WordsCloud.vue'
import GlobalReport from '../components/reports/GlobalReport.vue'


export default {
  components: {
    EmojisWall,
    ActiveHours,
    WordsCloud,
    GlobalReport
  },
  name: 'Analysis',
}
</script>

<style>

</style>