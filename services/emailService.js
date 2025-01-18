const transporter = require("../emails/transporter");
const validator = require("validator")
const dns = require('dns');


class emailService{

    static async validateEmail(email) {
            if (!validator.isEmail(email)) {
              throw new Error("Formato de e-mail inválido");
            }
          
            const domain = email.split("@")[1];
          
            const hasValidMx = await new Promise((resolve, reject) => {
              dns.resolveMx(domain, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                  resolve(false); // Domínio inválido
                } else {
                  resolve(true); // Domínio válido
                }
              });
            });
          
            if (!hasValidMx) {
              throw new Error("O domínio do e-mail é inválido");
            }
          
            return  {status: true}; // E-mail válido
          }

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