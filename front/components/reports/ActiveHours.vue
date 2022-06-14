<template>
  <section class="section section--hours">
    <div class="section--hours__hourly-use">
      <h1>Your hourly use</h1>
      <radar-chart
        v-if="activeHoursChartData" 
        :chart-data="activeHoursChartData"
        :options="activeHoursChartOptions"
      />
    </div>
    <div class="section--hours__bedtime">
      It seems like you usually go to bed around 
      <strong><b-icon icon="weather-sunset-down" size="is-large" />{{bedTime.bed}}:00h</strong>
      and wake up at
      <strong><b-icon icon="weather-sunset-up" size="is-large" />{{bedTime.wake}}:00h</strong>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import RadarChart from '../charts/RadarChart.vue'

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
  components: {
    RadarChart
  },
  name: 'Analysis',
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
    ...mapState('analysis', [
      'activeHours',
    ]),
    ...mapGetters('analysis', [
      'bedTime'
    ])
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
    loadActiveHoursChartData () {
      if (this.activeHours) {
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
      }
    }
  }
}
</script>

<style>
.section--hours {
  background: linear-gradient(grey,#001122);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.section--hours__hourly-use {
  display: flex;
  align-items: center;
  justify-content: center;
}
.section--hours__bedtime {
  margin: 1rem;
  font-size: 1.5rem;
  color: #FFFFFFA0
}
.section--hours__bedtime strong {
  font-size: 45px;
  color: #FFFFFFFF
}
</style>