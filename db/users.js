const client = require("./client");

async function getAllUsers(){
  const {rows} = await client.query(`
    SELECT id, username, name, location, isadmin
    FROM users; 
  `)

  return rows
}

async function createUser({ username, password, name, location, email, isadmin }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password, name, location, email, isadmin)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username, email) DO NOTHING
        RETURNING *;
      `,
      [username, password, name, location, email, isadmin]
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields).map((key,index) => `"${key}" = $${index + 1}`).join(',')
  if (setString.length === 0){
    return
  } 

  try {
    const {rows: [user]} = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id = ${id}
      RETURNING * ;
    `,Object.values(fields))

    return user

  } catch (error) {
    throw(error)
  }
}

async function getUser({ username, password }) {
  if (!username || !password) {
    return null;
  }
  if (username && password) {
    try {
      const singleUser = await getUserByUserName(username);

      if (!singleUser) {
        return null;
      }

      if (password === singleUser.password) {
        delete singleUser.password;
        return singleUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username, password, isadmin
        FROM users
        WHERE id = ${userId}
      `);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByUserName(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username = $1
      `,
      [userName]
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
  getUserById,
  getUserByUserName,
};
