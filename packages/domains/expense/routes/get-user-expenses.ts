import { ApiError } from '../../../utils/errors';
import { getUserExpenses } from '../model';
import { Router } from 'express';
import { secureTrim } from '../formatter';
import { to } from '../../../utils/async';

export const router = Router();

router.get('/get-user-expenses', async (req, res, next) => {
  const [userError, userExpenses] = await to(getUserExpenses(req.query?.userId));

  if (userError) {
    return next(new ApiError(userError, userError.status, `Could not get user expenses: ${userError}`, userError.title, req));
  }

  if (!userExpenses) {
    return res.json({});
  }

  return res.json(secureTrim(userExpenses));
});
