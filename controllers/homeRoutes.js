const router = require("express").Router();
const { User, Post } = require("../models");
const auth = require("../utils/auth");

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
    if(!postsData.length) {
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

router.get("/home", async (req, res) => {
  res.redirect("/");
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const postsData = await Post.findAll({
      include: [{
        model: User,
        attributes: [
          "id",
          "username"
        ]
      }],
      where: {user_id: req.session.user_id}
    });
    if(!postsData.length) {
      res.render("notFound");
    } else {
      const posts = postsData.map(post => post.get({plain:true}));
      console.log(posts);
      res.render("dashboard", {posts});
    }
  } catch(err){
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});


module.exports = router;
