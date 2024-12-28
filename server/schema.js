const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Option {
    id: ID!
    text: String!
    votes: Int!
  }

  type Question {
    id: ID!
    text: String!
    options: [Option!]!
  }

  type Questionnaire {
    id: ID!
    title: String!
    questions: [Question!]!
  }

  type Query {
    getQuestionnaires: [Questionnaire!]!
    getQuestionnaire(id: ID!): Questionnaire
  }

  type Mutation {
    createQuestionnaire(
      title: String!
      questions: [QuestionInput!]!
    ): Questionnaire!
    vote(questionId: ID!, optionId: ID!): Option!
  }

  type Subscription {
    questionnaireUpdated: Questionnaire
  }

  input QuestionInput {
    text: String!
    options: [OptionInput!]!
  }

  input OptionInput {
    text: String!
  }
`;

module.exports = typeDefs;
