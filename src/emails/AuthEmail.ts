import { transporter } from "../config/nodemailer"

interface IEmail {
  email: string
  name: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: 'DI-ORT <di-ort-adm@ort.cdmx.gob.mx>',
      to: user.email,
      subject: 'DI-ORT - Confirma tu cuenta',
      text: 'DI-ORT - Confirma tu cuenta',
      html: `<p>Hola: ${user.name}, has creado tu cuenta en DI-ORT, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
    })

    console.log('Mensaje enviado', info.messageId)
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: 'DI-ORT <di-ort-adm@ort.cdmx.gob.mx>',
      to: user.email,
      subject: 'DI-ORT - Reestablece tu password',
      text: 'DI-ORT - Reestablece tu password',
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
    })

    console.log('Mensaje enviado', info.messageId)
  }
}