<script setup lang="ts">
import HelloWorldVue from '@/components/HelloWorld.vue'
</script>

<template>
  <div>
    <h4 class="whitespace-pre-wrap mb-8 font-bold text-lg">
      To connect your account add it as an URL parameter<br />
      (ex.: /account/danail.near)
    </h4>
    <HelloWorldVue msg="Vite + Vue 3 + Typescript + Pinia + File Based Routing" />
  </div>
</template>

<route lang="yaml">
meta:
  isAuth: true
  role: ['admin', 'tes', 'user']
</route>
