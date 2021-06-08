const User = require("./User");
const Post = require("./Post");

Post.belongsTo(User, {
  foreingKey: "user_id"
});

User.hasMany(Post, {
  foreingKey: "user_id",
  onDelete: "CASCADE",
  OnUpdate: "CASCADE"
});

module.exports = {
  User,
  Post
};
