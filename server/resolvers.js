const { PubSub } = require("graphql-subscriptions");
const db = require("./app/models/index");

const { Questionnaire, Question, Option } = db;
const pubsub = new PubSub();

const QUESTIONNAIRE_UPDATED = "QUESTIONNAIRE_UPDATED";

const resolvers = {
  Query: {
    async getQuestionnaires() {
      return await Questionnaire.findAll({
        include: { all: true, nested: true },
      });
    },
    async getQuestionnaire(_, { id }) {
      return await Questionnaire.findByPk(id, {
        include: { all: true, nested: true },
      });
    },
  },
  Mutation: {
    async createQuestionnaire(_, { title, questions }) {
      const questionnaire = await Questionnaire.create(
        { title },
        { include: ["questions"] }
      );
      for (const q of questions) {
        const question = await Question.create({
          text: q.text,
          questionnaireId: questionnaire.id,
        });
        for (const o of q.options) {
          await Option.create({ text: o.text, questionId: question.id });
        }
      }
      const createdQuestionnaire = await Questionnaire.findByPk(
        questionnaire.id,
        {
          include: { all: true, nested: true },
        }
      );
      pubsub.publish(QUESTIONNAIRE_UPDATED, {
        questionnaireUpdated: createdQuestionnaire,
      });
      return createdQuestionnaire;
    },
    async vote(_, { questionId, optionId }) {
      const option = await Option.findByPk(optionId);
      option.votes += 1;
      await option.save();

      const questionnaire = await Questionnaire.findByPk(
        await (
          await Question.findByPk(questionId)
        ).questionnaireId,
        { include: { all: true, nested: true } }
      );
      pubsub.publish(QUESTIONNAIRE_UPDATED, {
        questionnaireUpdated: questionnaire,
      });
      return option;
    },
  },
  Subscription: {
    questionnaireUpdated: {
      subscribe: () => pubsub.asyncIterator([QUESTIONNAIRE_UPDATED]),
    },
  },
};

module.exports = resolvers;
