import _ from 'lodash'

export const state = () => ({
  json: undefined
})

export const mutations = {
  setJSON(state, json) {
    state.json = json
  },
}

export const actions = {
  loadFromTelegram ({ commit }, file) {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const result = event.target.result
      commit('setJSON', JSON.parse(result))
    })
    reader.readAsText(file)
  }
}

export const getters = {
  user (state) {
    return `user${state.json.personal_information.user_id}`
  },
  emojis (state, getters) {
    const emojis = {}
    if (state.json) {
      state.json.chats.list.map(
        chat => {
          chat.messages.map(message => {
            if (message.from_id === getters.user && message.text.match) {
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
  },
  words (state, getters) {
    const words = {}
    if (state.json) {
      state.json.chats.list.map(
        chat => {
          chat.messages.map(message => {
            if (message.from_id === getters.user && message.text.match) {
              const message_words = message.text.match(/\b(\w+)\b/g)
              if (message_words) {
                message_words.map(word => {
                  if (word.length > 4) {
                    words[word] = words[word] ? words[word] + 1 : 1
                  }
                })
              }
            }
          })
        }
      )
    }
    return _.pickBy(words, word => word > 100)
  }
}
