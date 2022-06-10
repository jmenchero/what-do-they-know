import _ from 'lodash'
import RedshiftData from "aws-sdk/clients/redshiftdata"

function mapAllMessagesFromAllChats (chats, messageMapFunction) {
  chats.map(chat => chat.messages.map(messageMapFunction))
}

function mapUserMessagesFromAllChats (chats, user, messageMapFunction) {
  mapAllMessagesFromAllChats(chats, message => {
    if (message.from_id === user) {
      messageMapFunction(message)
    }
  })
}

function getMessageEmojis (message) {
  if (message.text.match) {
    return message.text.match(/\p{Extended_Pictographic}/ug)
  } else {
    return []
  }
}

function getMessageWords (message) {
  if (message.text.match) {
    return message.text.match(/\b(\w+)\b/g)
  } else {
    return []
  }
}

function emojisWall (chats, user) {
  const emojis = {}
  mapUserMessagesFromAllChats(chats, user, message => {
    const message_emojis = getMessageEmojis(message)
    if (message_emojis) {
      // Increment emoji's counter
      message_emojis.map(emoji => {
        emojis[emoji] = emojis[emoji] ? emojis[emoji] + 1 : 1
      })
    }
  })
  return emojis
}

function wordsCloud (chats, user) {
  const words = {}
  mapUserMessagesFromAllChats(chats, user, message => {
    const messageWords = getMessageWords(message)
    if (messageWords) {
      messageWords.map(word => {
        if (word.length > 4) {
          words[word] = words[word] ? words[word] + 1 : 1
        }
      })
    }
  })
  const highlyRepeatedWords = _.pickBy(words, word => word > 100)
  return highlyRepeatedWords
}

function activeHours (chats, user) {
  const activeHours = {}
  mapUserMessagesFromAllChats(chats, user, message => {
    const hour = new Date(message.date).getHours()
    activeHours[hour] = activeHours[hour] ? activeHours[hour] + 1 : 1
  })
  return activeHours
}

function anualMessages (chats, user) {
  let anualMessages = 0
  mapUserMessagesFromAllChats(chats, user, message => {
    const year = new Date(message.date).getFullYear()
    if (year === 2021) {
      anualMessages += 1
    }
  })
  return anualMessages
}

function averageLength (chats, user) {
  let lengthSum = 0
  let totalMessages = 0
  mapUserMessagesFromAllChats(chats, user, message => {
    lengthSum += message.text.length
    totalMessages += 1
  })
  return Math.round(lengthSum/totalMessages)
}

export const state = () => ({
  emojisWall: undefined,
  wordsCloud: undefined,
  activeHours: undefined,
  anualMessages: undefined,
  averageLength: undefined,
  globalAnalysis: undefined
})

export const mutations = {
  setEmojisWall(state, emojisWall) {
    state.emojisWall = emojisWall
  },
  setWordsCloud(state, wordsCloud) {
    state.wordsCloud = wordsCloud
  },
  setActiveHours(state, activeHours) {
    state.activeHours = activeHours
  },
  setAnualMessages(state, anualMessages) {
    state.anualMessages = anualMessages
  },
  setAverageLength(state, averageLength) {
    state.averageLength = averageLength
  },
  setGlobalAnalysis(state, globalAnalysis) {
    state.globalAnalysis = globalAnalysis
  }
}

export const actions = {
  loadFromTelegram ({ commit }, file) {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const jsonFile = event.target.result
      const telegramData = JSON.parse(jsonFile)
      const user = `user${telegramData.personal_information.user_id}`
      const chats = telegramData.chats.list
      commit('setEmojisWall', emojisWall(chats, user))
      commit('setWordsCloud', wordsCloud(chats, user))
      commit('setActiveHours', activeHours(chats, user))
      commit('setAnualMessages', anualMessages(chats, user))
      commit('setAverageLength', averageLength(chats, user))
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
    redshiftData.executeStatement({
      ClusterIdentifier: 'wdtk-cluster',
      Database: 'wdtk_db',
      DbUser: 'wdtkfront',
      Sql: sql
    })
  },
  fetchGlobalData ({ commit }) {
    var redshiftData = new RedshiftData({
      accessKeyId: 'AKIAW64YNGGHYK7FKRXA',
      secretAccessKey: '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',
      region: 'eu-west-3'
    })
    const sql = `select
      max(totalanualmessages),
      min(totalanualmessages),
      avg(totalanualmessages),
      max(averagemessagelength),
      min(averagemessagelength),
      avg(averagemessagelength)
    from globalstats;`
    redshiftData.executeStatement({
      ClusterIdentifier: 'wdtk-cluster',
      Database: 'wdtk_db',
      DbUser: 'wdtkfront',
      Sql: sql
    }).promise().then(response => {
      redshiftData.getStatementResult({Id: response.Id}).promise().then(response => {
        const globalAnalysis = {
          anualMessages: {
            max: response.Records[0][0],
            min: response.Records[0][1],
            avg: response.Records[0][2]
          },
          messageLength: {
            max: response.Records[0][3],
            min: response.Records[0][4],
            avg: response.Records[0][5]
          }
        }
        commit('setGlobalAnalysis', globalAnalysis)
      })
    })
  }
}

export const getters = {}
