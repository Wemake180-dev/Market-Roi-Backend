import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6b21b698eb0bbf",
      pass: "126c0b0d710f77"
    }
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Market-Roi" <cuentas@market-roi.com>',
    to: email,
    subject: "Market-Roi - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en Market-Roi",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en Market-Roi</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    
    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6b21b698eb0bbf",
      pass: "126c0b0d710f77"
    }
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Market-Roi - Administrador de Proyectos" <cuentas@Market-Roi.com>',
    to: email,
    subject: "Market-Roi - Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>

    <p>Sigue el siguiente enlace para generar un nuevo password: 

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
    
    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    
    
    `,
  });
};
