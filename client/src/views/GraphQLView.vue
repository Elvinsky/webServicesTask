<template>
  <div>
    <h1>Questionnaire System</h1>

    <section>
      <h2>All Questionnaires</h2>
      <ul>
        <li v-for="questionnaire in questionnaires.getQuestionnaires" :key="questionnaire.id">
          <h3>{{ questionnaire.title }}</h3>
          <ul>
            <li v-for="question in questionnaire.questions" :key="question.id">
              <p>{{ question.text }}</p>
              <ul>
                <li v-for="option in question.options" :key="option.id">
                  {{ option.text }} - Votes: {{ option.votes }}
                  <button @click="vote(question.id, option.id)">Vote</button>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- Create new questionnaire -->
    <section>
      <h2>Create a New Questionnaire</h2>
      <form @submit.prevent="createQuestionnaire">
        <label>
          Title:
          <input v-model="newQuestionnaire.title" required />
        </label>
        <div v-for="(question, qIndex) in newQuestionnaire.questions" :key="qIndex">
          <label>
            Question:
            <input v-model="question.text" required />
          </label>
          <div v-for="(option, oIndex) in question.options" :key="oIndex">
            <label>
              Option:
              <input v-model="option.text" required />
            </label>
          </div>
          <button type="button" @click="addOption(qIndex)">Add Option</button>
        </div>
        <button type="button" @click="addQuestion">Add Question</button>
        <button type="submit">Create</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_QUESTIONNAIRES = gql`
  query {
    getQuestionnaires {
      id
      title
      questions {
        id
        text
        options {
          id
          text
          votes
        }
      }
    }
  }
`

const CREATE_QUESTIONNAIRE = gql`
  mutation ($title: String!, $questions: [QuestionInput!]!) {
    createQuestionnaire(title: $title, questions: $questions) {
      id
      title
    }
  }
`

const VOTE = gql`
  mutation ($questionId: ID!, $optionId: ID!) {
    vote(questionId: $questionId, optionId: $optionId) {
      id
      text
      votes
    }
  }
`

const QUESTIONNAIRE_UPDATED = gql`
  subscription {
    questionnaireUpdated {
      id
      title
      questions {
        id
        text
        options {
          id
          text
          votes
        }
      }
    }
  }
`

const questionnaires = ref([])
const { result: queryResult, refetch } = useQuery(GET_QUESTIONNAIRES)
const { mutate: createQuestionnaireMutation } = useMutation(CREATE_QUESTIONNAIRE)
const { mutate: voteMutation } = useMutation(VOTE)

onMounted(() => {
  if (queryResult.value) {
    questionnaires.value = queryResult.value.getQuestionnaires
  }
})

useSubscription(QUESTIONNAIRE_UPDATED, {
  onResult: ({ data }) => {
    console.log(123)
    if (data) {
      const updatedQuestionnaire = data.questionnaireUpdated
      const index = questionnaires.value.findIndex((q) => q.id === updatedQuestionnaire.id)
      if (index !== -1) {
        questionnaires.value[index] = updatedQuestionnaire
      } else {
        questionnaires.value.push(updatedQuestionnaire)
      }
    }
  },
})

const newQuestionnaire = ref({
  title: '',
  questions: [
    {
      text: '',
      options: [{ text: '' }, { text: '' }],
    },
  ],
})

const addQuestion = () => {
  newQuestionnaire.value.questions.push({ text: '', options: [{ text: '' }, { text: '' }] })
}

const addOption = (qIndex) => {
  newQuestionnaire.value.questions[qIndex].options.push({ text: '' })
}

const createQuestionnaire = async () => {
  await createQuestionnaireMutation({
    variables: {
      title: newQuestionnaire.value.title,
      questions: newQuestionnaire.value.questions.map((q) => ({
        text: q.text,
        options: q.options.map((o) => ({ text: o.text })),
      })),
    },
  })
  newQuestionnaire.value = {
    title: '',
    questions: [
      {
        text: '',
        options: [{ text: '' }, { text: '' }],
      },
    ],
  }
  await refetch()
}

const vote = async (questionId, optionId) => {
  await voteMutation({ variables: { questionId, optionId } })
}
</script>
