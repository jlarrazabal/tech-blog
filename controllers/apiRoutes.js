const router = require("express").Router();
const {User, Post, Comment} = require("../models");
const auth = require("../utils/auth");

//Signup and Create User
router.post("/signup", async (req, res) => {
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
    const lookUsername = await User.findOne({where: {username: req.body.username}});
    if(!lookUsername) {
      const newUser = await User.create({
        username: req.body.username,
        password: req.body.password
      });
      req.session.save(async () => {
        const postsData = await Post.findAll({
          include: [{
            model: User,
            attributes: [
              "id",
              "username"
            ]
          }]
        });
        req.session.user_id = newUser.id;
        req.session.loggedIn = true;
        console.log(newUser);
        if(!postsData.length) {
          res.render("notFound", {loggedIn: req.session.loggedIn, user_id: req.session.user_id});
        } else {
          const posts = postsData.map(post => post.get({plain:true}));
          console.log(posts);
          res.render("home", {loggedIn: req.session.loggedIn, user_id: req.session.user_id, posts: {posts}});
        }
      });
    } else {
      res.render("existingUsername");
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//User Login
router.post("/login", async (req, res) => {
  
});

//User Logout
router.get("/logout", async (req, res) => {
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
      if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.render("notFound");
        });
      } else {
        res.render("notFound");
      }
    } else {
      const posts = postsData.map(post => post.get({plain:true}));
      console.log(posts);
      if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.render("home", {posts});
        });
      } else {
        res.render("home", {posts});
      }
    }
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
