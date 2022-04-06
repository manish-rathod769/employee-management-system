const Leave = require('../../models/leave');

const regissterLeave = async (req, res) => {
    console.log("here we go")
    // const userdata = new Leave(req.body);

    // console.log(userdata);
    
    // const data = userdata.save().then((result) => {
    //     console.log(result)
    // }).catch((e) => {
    //     console.log(e)
    // })
    // if (data) {
    //     res.render('login', { success: "YOU ARE SUCCESSFULLY REGISTERED!!" })
    //     // const blogdata = await Post.find();
    //     // res.render('allblog', { posts: blogdata });
    // } else {
    //     res.redirect('/register-view');
    // }

}

module.exports = regissterLeave;