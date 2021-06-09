const router = require("express").Router();
const { User, Post } = require("../models");
const auth = require('../utils/auth');

router.get("/", async (req, res) => {
  try {
    const postsData = await Post.findAll({
      include: [{
        model: User,
        attributes: [
          "id",
          "username"
        ]
      }]
    });
    if(!postsData) {
      res.render("notFound");
    } else {
      const posts = postsData.map(post => post.get({plain:true}));
      console.log(posts);
      res.render("home", {posts});
    }
  } catch(err){
    res.status(500).json(err);
  }
});

router.get('/post/:id', auth, async (req, res) => {


});

module.exports = router;
