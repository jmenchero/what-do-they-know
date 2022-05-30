import _ from 'lodash'
import RedshiftData from "aws-sdk/clients/redshiftdata"

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
  },
  dumpAnonymizedData ({ getters }) {
    var redshiftData = new RedshiftData({
      accessKeyId: 'AKIAW64YNGGHYK7FKRXA',
      secretAccessKey: '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',
      region: 'eu-west-3'
    })
    const sql = `insert into globalstats
    (totalanualmessages, averagemessagelength)
    values (${getters.anualMessages}, ${getters.averageLength});`
    debugger
    redshiftData.executeStatement({
      ClusterIdentifier: 'wdtk-cluster',
      Database: 'wdtk_db',
      DbUser: 'wdtkfront',
      Sql: sql
    }).promise().then(response => {
      debugger
    })
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
  },
  activeHours (state, getters) {
    const activeHours = {}
    if (state.json) {
      state.json.chats.list.map(
        chat => {
          chat.messages.map(message => {
            if (message.from_id === getters.user) {
              const hour = new Date(message.date).getHours()
              activeHours[hour] = activeHours[hour] ? activeHours[hour] + 1 : 1
            }
          })
        }
      )
    }
    return activeHours
  },
  anualMessages (state, getters) {
    let anualMessages = 0
    if (state.json) {
      state.json.chats.list.map(
        chat => {
          chat.messages.map(message => {
            if (message.from_id === getters.user) {
              const year = new Date(message.date).getFullYear()
              if (year === 2021) {
                anualMessages += 1
              }
            }
          })
        }
      )
    }
    return anualMessages
  },
  averageLength (state, getters) {
    let lengthSum = 0
    let totalMessages = 0
    if (state.json) {
      state.json.chats.list.map(
        chat => {
          chat.messages.map(message => {
            if (message.from_id === getters.user) {
              lengthSum += message.text.length
              totalMessages += 1
            }
          })
        }
      )
    }
    return Math.round(lengthSum/totalMessages)
  }
}
