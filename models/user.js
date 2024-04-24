/** User class for message.ly */
const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config")


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    try{
      if(!username || !password){
        throw new ExpressError("Username and password required", 400);
      }
  
      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  
      const results = await db.query(`INSERT INTO users(username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING username, first_name, last_name, phone`,
    [username, hashedPassword, first_name, last_name, phone]);
    returne res.json(results.rows[0]);
    } catch(e) {
      next(e);
    }


   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try{
      if(!username || !password){
        throw new ExpressError("Username and password required", 400);
      }
      const results = await db.query(`SELECT username, password FROM users WHERE username = $1`,[username]);
      const user = results.rows[0];
      if(user){
        if(await bcrypt.compare(password, user.password)){
          const token = jwt.sign({ username }, SECRET_KEY);
          return res.json({message: `Logged in!`, token})
        }
      }
    } catch(e){
      next(e)
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;