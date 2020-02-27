"use strict";

const crypto = require("crypto");
const Mail = use("Mail");
const User = use("App/Models/User");

class ForgotPasswordController {
  async store({ request }) {
    const { email, redirect_to } = request.all();
    const user = await User.findBy("email", email);

    user.token = crypto.randomBytes(10).toString("hex");
    user.token_created_at = new Date();

    await user.save();

    await Mail.send(
      ["emails.forgot_password", "emails.forgot_password-text"],
      { email, token: user.token, link: `${redirect_to}?token=${user.token}` },
      message => {
        message
          .to(user.email)
          .from("luisenriquegomesportugal@gmail.com", "Luis Portugal")
          .subject("Recuperação de Senha");
      }
    );
  }
}

module.exports = ForgotPasswordController;
