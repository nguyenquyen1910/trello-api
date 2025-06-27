import express from 'express'

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).json({ message: 'API V1 are ready to use'});
})

export const APIs_V1 = router;