const express = require("express");
const router = express.Router();

const { addPromotion, checkCoupon, finishOrder, getTransactions } = require("../controllers/orderController");

router.post("/add-promotion", addPromotion);
router.post("/checkout", checkCoupon);
router.post("/billing", finishOrder);
router.get("/transactions", getTransactions);

module.exports = router;
