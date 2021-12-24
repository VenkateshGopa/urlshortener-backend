var nodemailer = require("nodemailer");

const mailer = (email, code , sub) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tinyurlshortner@gmail.com",
        pass: "Tiny@1999",
      },
    });

    var mailOptions = {
      from: "tinyurlshortner@gmail.com",
      to: email,
      subject:  `${sub}`,
      // text: 'That was easy!'
      html: `<p>${code} </p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        resolve(false);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = mailer;
