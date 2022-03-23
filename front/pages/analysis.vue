<template>
  <full-page ref="fullpage">
    <section class="section section--emojis">
      <div 
        v-for="(count, emoji) in emojis"
        :key="emoji"
        :style="emojiStyle(count)"
      >
        {{ emoji }}
      </div>
      <h1>Your emojis wall</h1>
    </section>
    <section class="section section--hours">
      <h1>Your hourly use</h1>
      <radar-chart :chart-data="activeHoursChartData" :options="chartOptions" />
    </section>
  </full-page>
</template>

<script>
import { mapGetters } from 'vuex'
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
      chartOptions: {
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
    ...mapGetters('analysis', ['emojis', 'words', 'activeHours']),
  },
  mounted () {
    this.loadActiveHoursChartData()
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    loadActiveHoursChartData () {
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
  background: linear-gradient(#001122,#000000);
  display: flex;
  justify-content: center;
}
.section--hours {
  background: grey;
  display: flex;
  justify-content: center;
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