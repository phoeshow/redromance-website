const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ClassSchema = new mongoose.Schema({
  class: String,
  icon: String,
});

const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: {
      type: String,
      set(val) {
        return bcrypt.hashSync(val, 10);
      },
      required: true,
    },
    // level of authority
    loa: {
      type: Number,
      required: true,
    },
    characters: [
      {
        name: String,
        class: ClassSchema,
      },
    ],
  })
);

module.exports = UserModel;

exports.ClassSchema = ClassSchema;
