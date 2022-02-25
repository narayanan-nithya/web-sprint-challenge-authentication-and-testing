const db = require('../../data/dbConfig')

async function add (user){
    const [id] = await db('users').insert(user)
    return db('users').where('id', id).first()
}

function findBy(filter){
    return db('users').where(filter)
}

module.exports ={
    add,
    findBy
}