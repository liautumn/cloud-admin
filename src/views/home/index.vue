<template>
  <div class="home card">
    <!-- <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" /> -->
    <!-- 测试 -->

    <Vue3Lottie :animationData="DogJSON" class="home-bg" />
  </div>
</template>

<script setup lang="ts" name="home">
import DogJSON from "../imagejson/home_bg.json";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
