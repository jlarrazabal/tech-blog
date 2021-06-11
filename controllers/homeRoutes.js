const router = require("express").Router();
const {
  User,
  Post
} = require("../models");
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
    if (!postsData.length) {
      if (req.session.loggedIn) {
        res.render("notFound", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id
        });
      } else {
        res.render("notFound");
      }
    } else {
      const posts = postsData.map(post => post.get({
        plain: true
      }));
      console.log(posts);
      if (req.session.loggedIn) {
        res.render("home", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id,
          posts: {
            posts
          }
        });
      } else {
        res.render("home", {
          posts
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
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
      where: {
        user_id: req.session.user_id
      }
    });
    if (!postsData.length) {
      if (req.session.loggedIn) {
        res.render("dashboard", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id
        });
      } else {
        res.render("dashboard");
      }
    } else {
      console.log(req.session.loggedIn);
      const posts = postsData.map(post => post.get({
        plain: true
      }));
      console.log(posts);
      if (req.session.loggedIn) {
        res.render("dashboard", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id,
          posts: {
            posts
          }
        });
      } else {
        res.render("dashboard", {
          posts
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/new-post", auth, async (req, res) => {
  res.render("newPost", {
    loggedIn: req.session.loggedIn,
    user_id: req.session.user_id
  });
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("*", async (req, res) => {
  res.redirect("/");
});

module.exports = router;
