const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  pool: true,
  auth: {
    user: "alija_ecommerc_app@outlook.com",
    pass: "alhos996",
  },
});
exports.sendPromotionEmail = (emails, newPromotion) => {
  const options = {
    from: "alija_ecommerc_app@outlook.com",
    to: emails.join(),
    subject: "Hello there dear costumer!",
    html: `<h3>Do you want to buy a book with an amaizing ${newPromotion.percentageDiscount}% discount?</h3> <br></br> <p>Go to our site now and use this promo code on checkout: <b>${newPromotion.promotionCode}</b></p> <br></br> <h4>Hurry up because this offer won't last forewer!</h4> `,
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info.response);
  });
};

exports.sendPurchaseEmail = (email, costumer) => {
  const options = {
    from: "alija_ecommerc_app@outlook.com",
    to: email,
    subject: "Purchase confirmation!",
    html: `<h3>Thank you for your purchase, ${costumer}!</h3> <br></br> <p>We wish you happy reading!</p> <br></br> <h4>More discounts ahead!</h4> `,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info.response);
  });
};

exports.sendRestockEmail = (books) => {
  const options = {
    from: "alija_ecommerc_app@outlook.com",
    to: config.emailForNotification,
    subject: "Reorder notification!",
    html: `<h3>Following books need reorder!</h3> <br></br> <ul>${books.map(
      (book) => `<li>${book}</li>`
    )}</ul> <br></br> <p>Please finish this soon!</p> `,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info.response);
  });
};
