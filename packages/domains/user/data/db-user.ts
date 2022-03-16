import { query } from '../../../utils/db';

export function readUser(userId) {
  return query('SELECT * FROM users WHERE id = $1', [userId])
    .then((response) => response.rows?.[0]);
}
