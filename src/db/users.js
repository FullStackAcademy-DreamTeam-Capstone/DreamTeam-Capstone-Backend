const client = require("./index");

async function createUser({username, password, name, location}) {
    try {
      const {rows: [users]} = await client.query(`
        INSERT INTO users(username, password, name, location)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *
      `,[username, password, name, location]);
      
      return users

    } catch (error) {
        console.error(error)
    }
}

async function updateUser() {}

async function getUser({username, password}) {
    if(!username || !password){
        return null
    }
    if(username && password){
        try {
          const singleUser = await getUserByUserName(username)
          
          if(!singleUser){
            return null
          }

          if(password === singleUser.password){
            delete singleUser.password
            return singleUser
          } else {
            return null
          }

        } catch (error) {
            throw error
        }
    }
}

async function getUserById(userId) {
    try {
      const {rows: [user]} = await client.query(`
        SELECT id, username
        FROM users
        WHERE id = ${userId}
      `)  

      return user
    } catch (error) {
        console.error(error)
    }
}

async function getUserByUserName(userName) {
    try {
      const {rows: [user]} = await client.query(`
        SELECT *
        FROM users
        WHERE username = $1
      `, [userName])
      
      return user

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUserById,
  getUserByUserName,
};
