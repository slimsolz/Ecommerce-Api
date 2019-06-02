/**
 * @module - Export functions to hash and verify password
 */
import bcrypt from 'bcrypt';

/**
 * @description - Hash customer password
 * @async
 *
 * @param {string} password - Password string
 *
 * @returns {Promise<string>}
 */
export const hashPassword = password => bcrypt.hashSync(password, 10);

/**
 * @description - Verifies customer password matches password in database
 * @async
 *
 * @param {string} password - Password string
 * @param {string} hashedPassword - Hashed password from database
 *
 * @returns {Promise<string>}
 */
export const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);
