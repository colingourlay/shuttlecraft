import express from 'express';
export const router = express.Router();

const notImplemented = (req, res) => {
  console.error(`Attempt to post to OAuth endpoint: "${req.path}"`);
  console.debug(req.body);

  return res.status(501).end();
};

router.post('*', notImplemented);
