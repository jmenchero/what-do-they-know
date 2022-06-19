<template>
    <div class="example">
        <iframe class="video" src="https://www.youtube.com/embed/9YK7o6XEclI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</template>

<script>

export default {
  name: 'Example'
}
</script>

<style scoped>
.example {
  background: linear-gradient(#7c4eff,#5aa4ba);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.video {
    width: 50%;
    height: 70%;
}
</style>
