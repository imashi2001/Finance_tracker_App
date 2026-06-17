const express = require("express");
const {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;
