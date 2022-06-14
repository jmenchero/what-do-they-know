<template>
  <section class="section section--words">
    <h1>Most used words</h1>
    <wordcloud
      v-if="wordsCloudList"
      :data="wordsCloudList"
      nameKey="word"
      valueKey="frequency"
      color="Category10"
      :showTooltip="true"
    />
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import wordcloud from 'vue-wordcloud'


export default {
  components: {
    wordcloud,
  },
  name: 'WordsCloud',
  computed: {
    ...mapState('analysis', [
      'wordsCloud',
    ]),
    wordsCloudList () {
      const wordsList = Object.keys(this.wordsCloud).map(word => {
        return {
          'word': word,
          'frequency': this.wordsCloud[word]
        }
      })
      return _.cloneDeep(wordsList)
    }
  }
}
</script>

<style>
.section--words {
  background: linear-gradient(#001122,grey);
  display: flex;
  flex-direction: column;
}
</style>