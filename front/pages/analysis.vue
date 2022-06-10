<template>
  <full-page ref="fullpage">
    <section class="section section--emojis">
      <div 
        v-for="(count, emoji) in emojisWall"
        :key="emoji"
        :style="emojiStyle(count)"
      >
        {{ emoji }}
      </div>
      <h1>Your emojis wall</h1>
    </section>
    <section class="section section--hours">
      <h1>Your hourly use</h1>
      <radar-chart
        v-if="activeHoursChartData" 
        :chart-data="activeHoursChartData"
        :options="activeHoursChartOptions"
      />
    </section>
    <section class="section section--global">
      <div class="global-report">
        <h1>You vs World</h1>
        <div v-if="!globalAnalysis" class="global-report__content">
          <p>If you want to check how your data compares to others you should allow us to process some of your data on our servers, but don't worry, none of your messages are shared, and everything will be anonymous.</p>
          <p>This is the only data you would be sharing with us:</p>
          <p class="strong">Anual Messages: {{ anualMessages }} messages</p>
          <p class="strong">Average Message Length: {{ averageLength }} characters</p>
          <b-button
            class="intro__button"
            type="is-primary"
            icon-left="upload"
            rounded
            @click="processGlobalAnalysis"
          >Agree and unlock the report!</b-button>
        </div>
        <div v-else class="global-report__content">
          <p>Anual Messages: {{ anualMessages }} vs {{ globalAnalysis.anualMessages.avg.longValue }}</p>
          <p>Average Message Length: {{ averageLength }} vs {{ globalAnalysis.messageLength.avg.longValue }}</p>
        </div>
      </div>
    </section>
  </full-page>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import RadarChart from '../components/RadarChart.vue'

let width, height, gradient;
function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.right, 0);
    gradient.addColorStop(0, '#FFC108');
    gradient.addColorStop(0.4, '#FFC108');
    gradient.addColorStop(0.5, '#000000');
    gradient.addColorStop(1, '#000000');
  }

  return gradient;
}
function gradientColor(context) {
  const chart = context.chart;
  const {ctx, chartArea} = chart;

  if (!chartArea) {
    return;
  }
  return getGradient(ctx, chartArea);
}

export default {
  components: { RadarChart },
  name: 'HomePage',
  data () {
    return {
      activeHoursChartData: null,
      activeHoursChartOptions: {
        scale: {
          gridLines: {
            circular: true,
          },
          ticks: {
            beginAtZero: true,
          },
          pointLabels: {
            fontSize: 25
          }
        },
        legend: {
          display: false
        },
      }
    }
  },
  computed: {
    ...mapState('analysis', ['emojisWall', 'wordsCloud', 'activeHours', 'anualMessages', 'averageLength', 'globalAnalysis']),
  },
  watch: {
    activeHours () {
      this.loadActiveHoursChartData()
    }
  },
  created () {
    this.loadActiveHoursChartData()
  },
  methods: {
    ...mapActions('analysis', ['dumpAnonymizedData', 'fetchGlobalData']),
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    processGlobalAnalysis () {
      this.dumpAnonymizedData()
      this.fetchGlobalData()
    },
    loadActiveHoursChartData () {
      const isActiveHoursEmpty = Object.keys(this.activeHours).length === 0
      if(!isActiveHoursEmpty) {
        this.activeHoursChartData = {
          labels: Object.keys(this.activeHours),
          datasets: [
            {
              label: 'Messages per hour',
              tension: 0.4,
              data: Object.values(this.activeHours),
              fill: true,
              borderColor: gradientColor,
            }
          ]
        }
      }
    },
    emojiStyle(count) {
      return `
        position: absolute;
        font-size: ${count}px;
        left: ${10+Math.floor(Math.random()*80)}vw;
        top: ${10+Math.floor(Math.random()*80)}vh;
        transform: translatey(0px);
        animation: float ${Math.random()*10+5}s ease-in-out;
      `
    }
  }
}
</script>

<style>
.section--emojis {
  background: linear-gradient(#001122,grey);
  display: flex;
  justify-content: center;
}
.section--hours {
  background: grey;
  display: flex;
  justify-content: center;
}
.section--global {
  background: linear-gradient(grey,#001122);
}

.global-report {
  margin: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.global-report p{
  font-size: 1vw;
  opacity: .8;
}

.global-report p.strong{
  font-size: 1.2vw;
  opacity: 1;
  margin-left: 2rem;
}

.global-report__content {
  margin: 2rem;
}

@keyframes float {
	0% {
		transform: translatey(100vh);
	}
	100% {
		transform: translatey(0vh);
	}
}
</style>