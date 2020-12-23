module.exports = {
  sanitizeUser: (user) => {
    const sanitizedUser = {};
    const safeProperties = ["firstName", "lastName", "_id", "email"];

    safeProperties.forEach((property) => {
      sanitizedUser[property] = user[property];
    });

    return sanitizedUser;
  },
};
