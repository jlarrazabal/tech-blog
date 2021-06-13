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
          posts: {
            posts
          }
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
          posts: {
            posts
          }
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

router.get("/post/new-comment/:id", auth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{
        model: User,
        attributes: [
          "id",
          "username"
        ]
      }],
      where: {
        id: req.params.id
      }
    });
    if (!postData) {
      if (req.session.loggedIn) {
        res.render("notFound", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id
        });
      } else {
        res.render("notFound")
      }
    } else {
      const posts = postData.map(post => post.get({
        plain: true
      }));
      if (req.session.loggedIn) {
        res.render("newComment", {
          loggedIn: req.session.loggedIn,
          user_id: req.session.user_id,
          posts: {
            posts
          }
        });
      } else {
        res.render("login");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

// router.get("/post/:id", async (req, res) => {
//   try{
//     const postData = await Post.findAll({
//       include: [{
//         model: User,
//         attributes: [
//           "id",
//           "username"
//         ]
//       }],
//       where: {
//         id: req.params.id
//       }
//     });
//     if(!postData) {
//       if(req.session.loggedIn) {
//         res.render("notFound", {loggedIn: req.session.loggedIn, user_id: req.session.user_id});
//       } else {
//         res.render("notFound");
//       }
//     } else {
//       const posts = postData.map(post => post.get({
//         plain: true
//       }));
//       const commentsData = await Comment.findAll({where: {post_id: req.params.id}});
//       // if(req.session.loggedIn) {
//       //   res.render("post", {loggedIn: req.session.loggedIn, user_id: req.session.user_id, posts: {posts}});
//       // } else {
//       //   res.render("post", {posts: {posts}});
//       // }
//       if(!commentsData.length) {
//         if(req.session.loggedIn) {
//           res.render("post", {loggedIn: req.session.loggedIn, user_id: req.session.user_id, posts: {posts}});
//         } else {
//           res.render("post", {posts: {posts}});
//         }
//       } else {
//         const comments = commentsData.map(comment => comment.get({
//           plain: true
//         }));
//         if(req.session.loggedIn) {
//           res.render("post", {loggedIn: req.session.loggedIn, user_id: req.session.user_id, posts: {posts}, comments: {comments}});
//         } else {
//           res.render("post", {posts: {posts}, comments: {comments}});
//         }
//       }
//     }
//   } catch(err) {
//     res.status(500).json(err);
//   }
// });

router.get("/post/:id", async (req, res) => {
  try {
    // const postData = await Post.findAll({
    //   include: [{
    //     model: User,
    //     attributes: [
    //       "id",
    //       "username"
    //     ]
    //   }],
    //   where: {
    //     id: req.params.id
    //   }
    // });

    // const postData = await Post.findByPk(req.params.id, {
    //   include: [{
    //     model: User,
    //     attributes: [
    //       "id",
    //       "username"
    //     ]
    //   }],
    //   where: {
    //     id: req.params.id
    //   }
    // });

    const commentsData = await Comment.findAll();
    // const posts = postData.map(post => post.get({
    //   plain: true
    // }));
    res.send({
      commentsData
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("*", async (req, res) => {
  res.redirect("/");
});

module.exports = router;
