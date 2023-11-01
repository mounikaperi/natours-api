/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRouter");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    tourController.protectRoutesFromUnauthorizedAccess,
    tourController.restrictAccessTo(ROLES.ADMIN, ROLES.LEAD_GUIDE, ROLES.GUIDE),
    tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

router
  .route('/')
  .get(
    authController.protectRoutesFromUnauthorizedAccess,
    tourController.getAllTours)
  .post(
    authController.protectRoutesFromUnauthorizedAccess,
    authController.restrictAccessTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protectRoutesFromUnauthorizedAccess,
    authController.restrictAccessTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.updateTour)
  .delete(
    authController.protectRoutesFromUnauthorizedAccess,
    authController.restrictAccessTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.deleteTour
  )

module.exports = router;