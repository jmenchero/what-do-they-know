<template>
  <section class="section section--interactions">
    <h1>People you talked more with</h1>
    <line-chart
      v-if="monthlyInteractionsChartData"
      class="section--interactions__monthly-progress"
      :chart-data="monthlyInteractionsChartData"
      :options="monthlyInteractionsChartOptions"
      width="800px"
      height="400px"
    />
    <!-- <div class="section--interactions__bedtime">
      It seems like you usually go to bed around 
      <strong><b-icon icon="weather-sunset-down" size="is-large" />{{bedTime.bed}}:00h</strong>
      and wake up at
      <strong><b-icon icon="weather-sunset-up" size="is-large" />{{bedTime.wake}}:00h</strong>
    </div> -->
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LineChart from '../charts/LineChart.vue'

export default {
  components: {
    LineChart
  },
  name: 'Interactions',
  data () {
    return {
      monthlyInteractionsChartData: undefined,
      monthlyInteractionsChartOptions: {}
    }
  },
  computed: {
    ...mapState('analysis', [
      'monthlyInteractions',
    ]),
    ...mapGetters('analysis', [
      'bedTime'
    ])
  },
  watch: {
    monthlyInteractions () {
      this.loadMonthlyInteractionsChartData()
    }
  },
  created () {
    this.loadMonthlyInteractionsChartData()
  },
  methods: {
    loadMonthlyInteractionsChartData () {
      if (this.monthlyInteractions) {
        const isMonthlyInteractionsEmpty = Object.keys(this.monthlyInteractions).length === 0
        if(!isMonthlyInteractionsEmpty) {
          const datasets = Object.keys(this.monthlyInteractions).map(user => {
            const userProgression = this.monthlyInteractions[user]
            return {
              label: user,
              data: Object.values(userProgression),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.5
            }
          })
          this.monthlyInteractionsChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets
          }
        }
      }
    }
  }
}
</script>

<style>
.section--interactions {
  background: linear-gradient(grey,#001122);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.section--interactions__monthly-progress {
  display: flex;
  align-items: center;
  justify-content: center;
}
.section--interactions__bedtime {
  margin: 1rem;
  font-size: 1.5rem;
  color: #FFFFFFA0
}
.section--interactions__bedtime strong {
  font-size: 45px;
  color: #FFFFFFFF
}
</style>