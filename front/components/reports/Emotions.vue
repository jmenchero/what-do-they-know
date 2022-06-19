<template>
  <section class="section section--emotions">
    <h1>How you felt through the year</h1>
    <line-chart
      v-if="monthlyEmotionsChartData"
      class="section--emotions__monthly-progress"
      :chart-data="monthlyEmotionsChartData"
      :options="monthlyEmotionsChartOptions"
      width="800px"
      height="400px"
    />
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LineChart from '../charts/LineChart.vue'

export default {
  components: {
    LineChart
  },
  name: 'Emotions',
  data () {
    return {
      monthlyEmotionsChartData: undefined,
      monthlyEmotionsChartOptions: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 14,
              fontColor: 'grey'
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 20,
              fontColor: 'white'
            }
          }]
        }
      }
    }
  },
  computed: {
    ...mapState('analysis', [
      'monthlyEmotions',
    ])
  },
  watch: {
    monthlyEmotions () {
      this.loadMonthlyEmotionsChartData()
    }
  },
  created () {
    this.loadMonthlyEmotionsChartData()
  },
  methods: {
    loadMonthlyEmotionsChartData () {
      if (this.monthlyEmotions) {
        const isMonthlyEmotionsEmpty = Object.keys(this.monthlyEmotions).length === 0
        if(!isMonthlyEmotionsEmpty) {
          this.monthlyEmotionsChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: 'Overall mood',
                data: Object.values(this.monthlyEmotions),
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5
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
.section--emotions {
  background: linear-gradient(grey,#001122);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.section--emotions__monthly-progress {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>