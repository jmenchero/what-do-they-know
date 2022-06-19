import _ from 'lodash'
import RedshiftData from 'aws-sdk/clients/redshiftdata'
import sentiment from 'sentiment-multilang'


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

function monthlyEmotions (chats, user) {
  const monthlyEmotions = {}
  _.range(12).forEach(month  => monthlyEmotions[month] = 0)
  mapUserMessagesFromAllChats(chats, user, message => {
    if (typeof message.text === 'string' && message.text.length > 5) {
      const messageDate = new Date(message.date)
      const year = messageDate.getFullYear()
      const month = messageDate.getMonth()
      if (year === 2021) {
        const englishScore = sentiment(message.text, 'en').score
        const spanishScore = sentiment(message.text, 'es').score
        monthlyEmotions[month] += englishScore + spanishScore
      }
    }
  })
  return monthlyEmotions
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
  const allHours = _.range(24)
  const activeHours = {}
  allHours.forEach((hour) => activeHours[hour] = 0)
  mapUserMessagesFromAllChats(chats, user, message => {
    const hour = new Date(message.date).getHours()
    activeHours[hour] = activeHours[hour] + 1
  })
  return activeHours
}

function topContacts(chats, user) {
  const users = []
  chats.map(chat => {
    if (chat.messages.length > 0) {
      const firstRecievedMessage = chat.messages.find(message => message.from_id !== user)
      if (firstRecievedMessage) {
        const username = firstRecievedMessage.from
        const userId = firstRecievedMessage.from_id
        const count = chat.messages.length
        if (username) users.push({ username, count, userId })
      }
    }
  })
  const rankedUsers = _.orderBy(users, 'count', 'desc')
  const topUsers = rankedUsers.slice(0, 10)
  return topUsers
}

function monthlyInteractions (chats, topUsers) {
  const chatInteractions = {}
  topUsers.map(user => {
    const userId = parseInt(user.userId.replace('user',''))
    const userChat = chats.find(chat => chat.id === userId)
    const monthlyInteractions = {}
    _.range(12).forEach(month  => monthlyInteractions[month] = 0)
    userChat.messages.map(message => {
      const messageDate = new Date(message.date)
      const year = messageDate.getFullYear()
      const month = messageDate.getMonth()
      if (year === 2021) {
        monthlyInteractions[month] = monthlyInteractions[month] + 1
      }
    })
    chatInteractions[user.username] = monthlyInteractions
  })
  return chatInteractions
}

function differenceWithNextHour (activeHours) {
  const differences = {}
  Object.keys(activeHours).map(hour => {
    const hourAsNumber = parseInt(hour)
    const nextHour = hourAsNumber === 23 ? 0 : hourAsNumber + 1
    differences[hour] = activeHours[nextHour] - activeHours[hour]
  })
  return differences
}

function bedTimeAnalysis (activeHours) {
  const differences = differenceWithNextHour(activeHours)
  const bedTime = Object.keys(differences).reduce((a, b) => (differences[a] < differences[b]) ? a : b)
  const wakeTime = Object.keys(differences).reduce((a, b) => (differences[a] > differences[b]) ? a : b)
  return {
    'bed': bedTime,
    'wake': wakeTime
  }
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
  favoriteContacts: undefined,
  monthlyInteractions: undefined,
  monthlyEmotions: undefined,
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
  setFavoriteContacts(state, favoriteContacts) {
    state.favoriteContacts = favoriteContacts
  },
  setMonthlyInteractions(state, monthlyInteractions) {
    state.monthlyInteractions = monthlyInteractions
  },
  setMonthlyEmotions(state, monthlyEmotions) {
    state.monthlyEmotions = monthlyEmotions
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
      const favoriteContacts = topContacts(chats, user)
      commit('setEmojisWall', emojisWall(chats, user))
      commit('setWordsCloud', wordsCloud(chats, user))
      commit('setActiveHours', activeHours(chats, user))
      commit('setAnualMessages', anualMessages(chats, user))
      commit('setFavoriteContacts', favoriteContacts)
      commit('setMonthlyInteractions', monthlyInteractions(chats, favoriteContacts))
      commit('setMonthlyEmotions', monthlyEmotions(chats, user))
      commit('setAverageLength', averageLength(chats, user))
    })
    reader.readAsText(file)
  },
  dumpAnonymizedData ({ getters }) {
    var redshiftData = new RedshiftData({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
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
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
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
      setTimeout(() => {
        redshiftData.getStatementResult({Id: response.Id}).promise().then((response) => {
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
      }, 500)
    })
  }
}

export const getters = {
  bedTime (state) {
    return bedTimeAnalysis(state.activeHours)
  }
}
