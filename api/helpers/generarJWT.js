import jwt from 'jsonwebtoken'

export const generateAuthToken = async (id, isSeller) => {
    return jwt.sign({ id, isSeller }, process.env.SECRET_KEY, {
        expiresIn: '3d'
    })
}
