<template>
  <section style="width: 100%">
    <full-page>
      <section class="section" style="background: #f59e0b">
        <h1>Export Telegram Data</h1>
        Make sure you have the latest version of Telegram Desktop installed on your computer, then click Settings > Export Telegram data.
        <video style="max-width: 640px;" vindex="1" preload="auto" autoplay muted loop>
          <source src="https://telegram.org/resources/video/ExDataBlog.mp4" type="video/mp4">
        </video>
      </section>
      <section class="section" style="background: #ef4444">
      <h1>Upload Chats</h1>
        <b-field class="file is-primary" :class="{'has-name': !!file}">
          <b-upload v-model="file" class="file-label">
            <span class="file-cta">
              <b-icon class="file-icon" icon="upload"></b-icon>
              <span class="file-label">Click to upload</span>
            </span>
            <span class="file-name" v-if="file">
              {{ file.name }}
            </span>
          </b-upload>
        </b-field>
      </section>
      <section class="section" style="background: #001122">
        <h1>Emojis</h1>
        {{ emojis }}
      </section>
    </full-page>
  </section>
</template>

<script>
export default {
  name: 'HomePage',

  data() {
    return {
      file: null,
      json: null
    }
  },

  watch: {
    file (newFile) {
      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        const result = event.target.result
        this.json = JSON.parse(result)
      })
      reader.readAsText(newFile)
    }
  },

  computed: {
    user () {
      return `user${this.json.personal_information.user_id}`
    },
    emojis () {
      const emojis = {}
      if (this.json) {
        this.json.chats.list.map(
          chat => {
            chat.messages.map(message => {
              if (message.from_id === this.user && message.text.match) {
                const message_emojis = message.text.match(/\p{Extended_Pictographic}/ug)
                if (message_emojis) {
                  message_emojis.map(emoji => {
                    emojis[emoji] = emojis[emoji] ? emojis[emoji] + 1 : 1
                  })
                }
              }
            })
          }
        )
      }
      return emojis
    }
  }
}
</script>

<style scoped>
.section {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}
</style>