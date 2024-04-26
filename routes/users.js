const Router = require("express").Router
const User = require("../models/user")
const {ensureCorrectUser, ensureLoggedIn} = require("../middleware/auth")
const router = new Router();



/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        let users = await User.all();
    return res.json({users})
    } catch(e){
        next(e)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureCorrectUser, async (req, res, next) => {
    try{
        const username = req.params.username;
        let user = await User.get(username);
        return res.json({user})
    } catch(e){
        next(e)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
    try{
        const username = req.params.username;
        let messagesTo = await User.messagesTo(username);
        return res.json({messagesTo})
    } catch(e){
        next(e)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
    try{
        const username = req.params.username;
        let messagesFrom = await User.messagesFrom(username);
        return res.json({messagesFrom})
    } catch(e){
        next(e)
    }
})

module.exports = router;