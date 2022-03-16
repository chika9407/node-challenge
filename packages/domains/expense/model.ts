import { format } from './formatter';
import { readUserExpenses } from './data/db-user-expense';
import { to } from '../../utils/async';
import { Expense } from './types';
import { BadRequest, InternalError, NotFound } from '../../utils/errors';

export async function getUserExpenses(userId): Promise<Expense> {
  if (!userId) {
    throw BadRequest('userId property is missing.');
  }

  const [dbError, rawExpense] = await to(readUserExpenses(userId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawExpense) {
    throw NotFound(`Could not find expenses for the user with id ${userId}`);
  }

  return format(rawExpense);
}
