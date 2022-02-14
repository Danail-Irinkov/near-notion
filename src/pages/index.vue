<script setup lang="ts">
import HelloWorldVue from '../components/HelloWorld.vue'
</script>

<template>
  <HelloWorldVue />
</template>

<route lang="yaml">
meta:
  isAuth: false
  role: ['admin', 'tes', 'user']
</route>
