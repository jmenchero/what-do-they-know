<template>
  <full-page ref="fullpage">
    <project-introduction
      @click-in-show="$refs.fullpage.scrollToSection(1)"
    />
    <telegram-guide />
  </full-page>
</template>

<script>
import ProjectIntroduction from '../components/intro/ProjectIntroduction.vue'
import TelegramGuide from '../components/intro/TelegramGuide.vue'

export default {
  components: { ProjectIntroduction, TelegramGuide },
  name: 'HomePage'
}
</script>

<style scoped>

</style>