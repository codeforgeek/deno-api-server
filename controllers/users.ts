import { Client } from "https://deno.land/x/mysql/mod.ts";
import { dbCreds } from '../config.ts'

// Init mysql client
const client = await new Client().connect({
    hostname: dbCreds.hostname,
    username: dbCreds.user,
    db: dbCreds.database,
    poolSize: dbCreds.poolsize,
    password: dbCreds.password,
  });

// @desc    Get all users
// @route   GET /api/v1/users
const getUsers = async ({ response }: { response: any }) => {
    try {
        const result = await client.execute("SELECT * FROM users")
        response.body = {
            success: true,
            data: result.rows
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    }
}

// @desc    Get single user
// @route   GET /api/v1/users/:id
const getUser = async ({ params, response }: { params: { id: string }, response: any }) => {
    try {
        const result = await client.execute("SELECT * FROM users WHERE ?? = ?", ["id", params.id])
        response.body = {
            success: true,
            data: result.rows
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    }
}

// @desc    Add user
// @route   Post /api/v1/users
const addUsers = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body()
    const data = body.value

    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data'
        }
    } else {
        try {
            const result = await client.execute("INSERT INTO users(name) VALUES(?)",[
            data.name])

            response.status = 201
            response.body = {
                success: true,
                data: result
            }
        } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        }
    }
}

// @desc    Update users
// @route   PUT /api/v1/users/:id
const updateUsers = async({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    await getUser({ params: { "id": params.id }, response })

    if(response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg
        }
        response.status = 404
        return
    } else {
        const body =  await request.body()
        const data = body.value

        if (!request.hasBody) {
            response.status = 400
            response.body = {
                success: false,
                msg: 'No data'
            }
        } else {
            try {
                const result = await client.execute("UPDATE users SET ??=? WHERE ??=?",
                ["name", data.name,
                "id", params.id])

                response.status = 200
                response.body = {
                    success: true,
                    data: result
                }
            } catch (err) {
                response.status = 500
                response.body = {
                    success: false,
                    msg: err.toString()
                }
            }
        }
    }
}

// @desc    Delete users
// @route   DELETE /api/v1/users/:id
const deleteUsers = async ({ params, response }: { params: { id: string }, response: any }) => {
    await getUser({ params: { "id": params.id }, response })

    if(response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg
        }
        response.status = 404
        return
    } else {
        try {
            const result = await client.query("DELETE FROM users WHERE ??=?", ["id", params.id])

            response.status = 200
            response.body = {
                success: true,
                msg: `Users with id ${params.id} has been deleted`
            }
        } catch (err) {
            response.status = 500
                response.body = {
                    success: false,
                    msg: err.toString()
                }
        }
    }
}

export { getUsers, getUser, addUsers, updateUsers, deleteUsers }