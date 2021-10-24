<template>
  <section class="section">
    <div class="columns is-mobile">
      <card
        title="Export Telegram Data"
        icon="send"
      >
        Make sure you have the latest version of Telegram Desktop installed on your computer, then click Settings > Export Telegram data.
        <video style="max-width: 640px;" vindex="1" preload="auto" autoplay muted loop>
          <source src="https://telegram.org/resources/video/ExDataBlog.mp4" type="video/mp4">
        </video>
      </card>

      <card
        title="Upload Chats"
        icon="upload"
      >
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
      </card>

      <card
        title="Emojis"
        icon="emoticon-outline"
      >
        {{ emojis }}
      </card>
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card
  },

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
