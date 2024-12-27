<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="wrapper">
    <header>
      <RouterLink to="/" active-class="active">Home</RouterLink>
      <RouterLink to="/graphQL" active-class="active">GraphQL Demo</RouterLink>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  position: sticky;
  top: 40px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 500px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 100px;
}

.active {
  background-color: white;
  color: black;
}

a {
  color: black;
  background-color: white;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
