const transporter = require("../emails/transporter");

class emailService{
    static async sendRecoverPasswordEmail(email, html){
        const mailOptions = {
            from: '"Lian Souza" <lianmiranda26@gmail.com>',
            to: email,
            subject: "Recuperação de senha",
            html: html,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            return { status: "success", message: "Email enviado com sucesso", response: info.response };
          } catch (error) {
            return { status: "failed", message: "Não foi possível enviar o email", error: error };
          }
    }
}

module.exports = emailService;