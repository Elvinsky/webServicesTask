const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    message: {
      type: GraphQLString,
      resolve() {
        return "Hello, World!";
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createMessage: {
      type: GraphQLString,
      args: {
        message: { type: GraphQLString },
      },
      resolve(parent, args) {
        return args.message;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
