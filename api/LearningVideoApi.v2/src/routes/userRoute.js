const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.post('/signUpTeacher', userController.signUpTeacher);
router.get('/persistLogin', authMiddleware, userController.persistLogin);
router.post('/login', userController.login)
router.post('/signUp', userController.signUp);
router.delete('/deleteAccount', authMiddleware, userController.deleteAccount);
router.put('/updateInfo', authMiddleware, userController.updateInfo);
router.patch('/updateAvatar', authMiddleware, userController.updateAvatar);

module.exports = router;