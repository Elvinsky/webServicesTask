<template>
  <div>
    <h1>{{ data?.message }}</h1>
    <p v-if="loading">Loading...</p>
    <p v-if="error">Error: {{ error.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GET_MESSAGE } from '../graphql/queries'

const { result: data, loading, error } = useQuery(GET_MESSAGE)
</script>
