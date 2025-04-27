import User from '../models/user.js';

// Find user by username
export async function findUserByUsername(username) {
    return await User.findOne({ where: { username } });
}

// Find user by ID, with restricted fields
export async function findUserById(id, attributes = ['id', 'username']) {
    return await User.findByPk(id, { attributes });
}

// Create new user
export async function createUser(username, passwordHash) {
    return await User.create({ username, passwordHash });
}