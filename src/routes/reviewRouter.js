const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const { ROLES } = require('../utils/constants');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoutesFromUnauthorizedAccess);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictAccessTo(ROLES.USER),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
