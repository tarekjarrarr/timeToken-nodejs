const router = require('express').Router();
router.use((req, res, next) => {
  res.payload = {};
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});

router.use('/user', require('./userRouter'));
router.use('/admin', require('./adminRouter'));
router.use('/company', require('./companyRouter'));
router.use('/promotion', require('./promotionRouter'));
router.use('/activity', require('./activityRouter'));
router.use('/transaction', require('./transactionRouter'));






module.exports = router;