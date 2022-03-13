import { query } from '@nc/utils/db';

export function readUserExpenses(userId) {
  return query('SELECT expenses.id, expenses.merchant_name, expenses.amount_in_cents, expenses.currency, expenses.date_created, expenses.status FROM expenses INNER JOIN users ON expenses.user_id = users.id WHERE id = $1 ', [userId])
    .then((response) => response.rows?.[0]);
}
