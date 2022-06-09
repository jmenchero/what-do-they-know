<template>
  <full-page ref="fullpage">
    <section class="section section--intro">
      <div class="intro__text">
        <h1>Want to check what do they know about you?</h1>
        <p>We all leave information about ourselves on the internet, with every google search and every message or email we send.</p>
        <p>But which kind of insights do big tech companies have available about us?</p>
        <b-button
          class="intro__button"
          type="is-primary"
          rounded
          @click="$refs.fullpage.scrollToSection(1)"
        >Show me my insights!</b-button>
      </div>
      <img class="intro__video" src="~/assets/summary.gif"/>
    </section>
    <section class="section section--upload">
      <video style="max-width: 640px;" vindex="1" preload="auto" autoplay muted loop>
        <source src="https://telegram.org/resources/video/ExDataBlog.mp4" type="video/mp4">
      </video>
      <div class="upload__text">
        <h1>Upload Chats</h1>
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
              <b-icon class="file-icon" icon="upload"></b-icon>
              <span class="file-label">Analyze chats</span>
            </span>
            <span class="file-name" v-if="file">
              {{ file.name }}
            </span>
          </b-upload>
        </b-field>
      </div>
    </section>
  </full-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'HomePage',

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
.intro__button {
  margin: 1rem;
  font-size: 1vw;
  float: right;
}
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