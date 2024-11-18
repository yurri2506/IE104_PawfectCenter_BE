const express = require("express");
const router = express.Router()
const FeedbackController = require('../controllers/Feedback.controller');

router.post('/create',FeedbackController.uploadFields,  FeedbackController.createFeedback);
router.patch('/update/:id',FeedbackController.uploadFields, FeedbackController.updateFeedback);
router.delete('/delete/:id', FeedbackController.deleteFeedback);
router.get('/get-all/:id', FeedbackController.getAllFeedback); // Lấy tất cả feedbacks theo mã sản phẩm

module.exports = router