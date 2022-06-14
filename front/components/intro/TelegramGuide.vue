<template>
  <section class="section section--upload">
    <video style="max-width: 640px;" vindex="1" preload="auto" autoplay muted loop>
      <source src="https://telegram.org/resources/video/ExDataBlog.mp4" type="video/mp4">
    </video>
    <div class="upload__text">
      <h1>Analyze Chats</h1>
      <p>We can recreate for you some of the infographics they generate from your data so you can understand better the kind of trace you leave online.</p>
      <p>All your data remains yours, everything is processed completely anonymously in your browser without sending anything over the network.</p>
      <p class="strong"> 1) Open the latest version of Telegram Desktop on your computer</p>
      <p class="strong"> 2) Click Settings -> Advanced -> Export Telegram data</p>
      <p class="strong"> 3) Disable all checks but "Personal chats"</p>
      <p class="strong"> 4) Select "Machine-readable JSON" format</p>
      <p class="strong"> 5) Click export</p>
      <p>Note: This is an opensource project targeting to promote learning about data analysis, feel free to check the code (or even contribute with improvements) in our <a href="https://github.com/jmenchero/what-do-they-know">github page</a>.</p>
      <b-field class="file is-primary" :class="{'has-name': !!file}">
        <b-upload v-model="file" class="file-label intro__button" rounded>
          <span class="file-cta">
            <b-icon class="file-icon" icon="poll"></b-icon>
            <span class="file-label">Explore data</span>
          </span>
          <span class="file-name" v-if="file">
            {{ file.name }}
          </span>
        </b-upload>
      </b-field>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TelegramGuide',

  data() {
    return {
      file: null
    }
  },

  watch: {
    file (file) {
      this.loadFromTelegram(file)
      this.$router.push('/analysis');
    }
  },

  methods: {
    ...mapActions('analysis', ['loadFromTelegram'])
  }
}
</script>

<style scoped>
.section--upload {
  background: #5aa4ba;
}
.upload__text {
  min-width: 400px;
  width: 50%;
  margin: 2rem;
}
.upload__text p{
  font-size: 1vw;
  opacity: .8;
}
.upload__text p.strong{
  font-size: 1.2vw;
  opacity: 1;
  margin-left: 2rem;
}
</style>