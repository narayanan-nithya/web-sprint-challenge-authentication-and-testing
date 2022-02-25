// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('.././data/dbConfig')


test('sanity', () => {
  expect(true).not.toBe(false)
})
beforeAll(async() =>{
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async()=>{
  await db.destroy()
})

describe('POST /api/auth/register', () => {

  test('[1] returns a new user with status 201', async() => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'thor', password:'hammer'})

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({username: "Thor"})
  })

  test('[2] returns an error message on Invalid username', async() => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'thor', password:'hammer'})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("username taken")
  })

  test('[3] returns an error message on Invalid username', async() => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'', password:''})

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/username and password required/i)
  })
})

describe('POST /api/auth/login', () => {
  test('[1] returns user welcome message', async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'thor', password:'hammer'})

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({message: "Welcome, thor"})
  })

  test('[2] returns an error on Invalid username', async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'hulk', password:'hammer'})

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("invalid credentials")
  })

  test('[3] returns an error message on missing username and password', async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'', password:''})

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/username and password required/i)
  })

})

describe('GET restricted /jokes', () => {
  test('[1] returns Unauthorized status code', async () => {
    const res = await request(server)
    .get('/api/jokes')

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/token required/i)
  })

  test('[2] returns jokes on authorized login', async() => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({username:'thor', password:"hammer"})

    const jokes = await request(server)
      .get('/api/jokes')
      .set("Authorization", res.body.token)

      expect(jokes.status).toBe(200)
      expect(jokes.body[0]).toHaveProperty("id")
      expect(jokes.body[0]).toHaveProperty("joke")
  })

  test('[3] returns Invalid token error', async() => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({username:'thor', password:"hammer"})

    const jokes = await request(server)
      .get('/api/jokes')
      .set("Authorization", "invalid token")

      expect(res.status).toBe(403)
      expect(res.body.message).toMatch(/token invalid/i)
  })
})
