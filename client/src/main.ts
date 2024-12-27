import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { provideApolloClient } from '@vue/apollo-composable'

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/graphql',
  }),
  cache: new InMemoryCache(),
})

const app = createApp(App)

provideApolloClient(apolloClient)

app.use(router)

app.mount('#app')
