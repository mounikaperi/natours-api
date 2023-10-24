const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protectRoutesFromUnauthorizedAccess,
  authController.updatePassword,
);
router.patch(
  '/updateMe',
  authController.protectRoutesFromUnauthorizedAccess,
  userController.updateMe,
);
router.delete(
  '/deleteMe',
  authController.protectRoutesFromUnauthorizedAccess,
  userController.deleteMe,
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
