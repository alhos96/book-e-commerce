const { Promotion, Order } = require("../models/orderModel");
const { User } = require("../models/userModel");
const { Book } = require("../models/bookModel");
const nodemailer = require("nodemailer");
const { sendPromotionEmail, sendPurchaseEmail, sendRestockEmail } = require("../mailer");

exports.addPromotion = async (req, res, next) => {
  const { percentageDiscount, expireAt } = req.body;

  let newPromotion = await new Promotion({
    promotionCode: Math.floor(100000 + Math.random() * 900000),
    percentageDiscount,
    expireAt,
  });

  await newPromotion.save();

  let members = await User.find({ member: true });

  let membersEmails = members.map((e) => e.email);

  sendPromotionEmail(membersEmails, newPromotion);

  res.status(200).json({ data: "Promotion created" });
};

exports.checkCoupon = async (req, res, next) => {
  const { coupon } = req.body;

  let existingCoupon = await Promotion.findOne({ promotionCode: coupon });

  if (existingCoupon) {
    let expireAt = new Date(existingCoupon.expireAt);
    let today = new Date();

    if (expireAt.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
      const error = new Error("Coupon expired!");
      console.log(error);
      return next(error);
    }

    res.json({ existingCoupon, message: "Coupon is valid!" });
  } else {
    const error = new Error("Coupon is not valid!");
    console.log(error);
    return next(error);
  }
};

exports.finishOrder = async (req, res, next) => {
  const { costumer, email, cartItems } = req.body;

  let newOrder = await new Order({
    costumer,
    cartItems,
  });

  await newOrder.save();

  sendPurchaseEmail(email, costumer);

  let books = [];

  for (const item of cartItems) {
    let book = await Book.findOne({ _id: item.id });

    book.stock -= 1;

    if (book.stock === 0) {
      book.stopOrder = true;
    }

    await book.save();

    if (book.stock === book.reorderNotification) {
      books.push(book.title);
    }
  }

  books.length > 0 && sendRestockEmail(books);

  res.json("Purchase successful!");
};

exports.getTransactions = async (req, res, next) => {
  let transactions = await Order.find();

  res.status(200).json(transactions);
};
