// Create a new user with a password for the specified database
db.createUser({
  user: 'benny',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'sopia' }],
});
