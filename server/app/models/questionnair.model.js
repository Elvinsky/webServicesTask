module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define("questionnaire", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const Question = sequelize.define("question", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const Option = sequelize.define("option", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  // Relationships
  Questionnaire.hasMany(Question, { as: "questions" });
  Question.belongsTo(Questionnaire);
  Question.hasMany(Option, { as: "options" });
  Option.belongsTo(Question);

  return { Questionnaire, Question, Option };
};
