import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


export const enviarEmail = async (datos) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, // generated ethereal user
            pass: process.env.MP, // generated ethereal password
        },
    });

    const { username, email, token } = datos
    await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email,
        subject: 'Confirmar Email',
        html: `Hi ${username}, to confirm your account you need to go to the link below
            <p><a href='${process.env.BACKEND_URL}:${process.env.PORT_FRONTEND}/confirmar-email/${token}'>Follow link</a></p>
        `,
    })

}



export const emailOlvidePassword = async (datos) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, // generated ethereal user
            pass: process.env.MP, // generated ethereal password
        },
    });

    const { username, email, token } = datos
    await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email,
        subject: 'Olvide Password',
        html: `Hola ${username}, to reset your password you need to go to the link below
            <p><a href='${process.env.BACKEND_URL}:${process.env.PORT_FRONTEND}/olvide-password/${token}'>Reset password</a></p>
            <p> If you did not request a password change, you can ignore this message.</p>
        `,
    })

}