const router = require("express").Router();
const {
  User,
  Post,
  Comment
} = require("../models");
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
    const lookUsername = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (!lookUsername) {
      const newUser = await User.create({
        username: req.body.username,
        password: req.body.password
      });
      req.session.save(async (err) => {
        if (err) {
          console.log(err);
        } else {
          req.session.user_id = newUser.id;
          req.session.loggedIn = true;
          const postsData = await Post.findAll({
            include: [{
              model: User,
              attributes: [
                "id",
                "username"
              ]
            }]
          });
          // console.log(newUser);
          if (!postsData.length) {
            res.render("notFound", {
              loggedIn: req.session.loggedIn,
              user_id: req.session.user_id
            });
          } else {
            const posts = postsData.map(post => post.get({
              plain: true
            }));
            console.log(posts);
            res.render("home", {
              loggedIn: req.session.loggedIn,
              user_id: req.session.user_id,
              posts: {
                posts
              }
            });
          }
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
    const userData = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (!userData) {
      res.render("noUser");
    } else {
      const validPassword = await userData.checkPassword(req.body.password);

      if (!validPassword) {
        res.render("noUser");
      }
      req.session.save(async (err) => {
        if (err) {
          console.log(err);
        } else {
          req.session.user_id = userData.id;
          req.session.loggedIn = true;
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
            res.render("notFound", {
              loggedIn: req.session.loggedIn,
              user_id: req.session.user_id
            });
          } else {
            const posts = postsData.map(post => post.get({
              plain: true
            }));
            console.log(posts);
            res.render("home", {
              loggedIn: req.session.loggedIn,
              user_id: req.session.user_id,
              posts: {
                posts
              }
            });
          }
        }
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//User Logout - Troubleshoot Issues
router.post("/logout", async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
    res.status(200).redirect("/").end();
    });
  } else {
    res.redirect("/");
  }
});

//Create Post
router.post("/new-post", auth ,async (req, res) => {
  try {
    let newDate = new Date();
    const newPost = await Post.create({
      post_title: req.body.postTitle,
      post_content: req.body.postContent,
      post_date: newDate,
      user_id: req.session.user_id
    });
    res.redirect("/dashboard");
  } catch(err) {
    res.status(500).json(err);
  }
});

//Create Comment
router.post("/post/new-comment/:id", auth ,async (req, res) => {
  try {
    let newDate = new Date();
    const newPost = await Comment.create({
      comment_content: req.body.commentContent,
      comment_date: newDate,
      post_id: req.params.id,
      user_id: req.session.user_id
    });
    res.redirect(`/post/${req.params.id}`);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
