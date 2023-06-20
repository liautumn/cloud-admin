<template>
  <div class="home card">
    <img class="home-bg" style="width: 50%" src="@/assets/images/welcome.png" alt="welcome" />
    <Vue3Lottie style="width: 50%" :animationData="DogJSON" class="home-bg" />
  </div>
</template>

<script setup lang="ts" name="home">
import { Vue3Lottie } from "vue3-lottie";
import DogJSON from "../imagejson/home_bg.json";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
