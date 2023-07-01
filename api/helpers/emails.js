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
        html: `Hola ${username}, para confirmar tu cuenta necesitas dirigirte al enlace a continuacion
            <p><a href='${process.env.BACKEND_URL}:${process.env.PORT_FRONTEND}/confirmar-email/${token}'>Seguir enlace</a></p>
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
        html: `Hola ${username}, para restablecer su contraseña necesitas dirigirte al enlace a continuacion
            <p><a href='${process.env.BACKEND_URL}:${process.env.PORT_FRONTEND}/olvide-password/${token}'>Restablecer password</a></p>
            <p> Si tu no solicitaste el cambio de password, puede ignorar este mensaje</p>
        `,
    })

}