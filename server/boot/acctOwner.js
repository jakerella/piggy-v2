module.exports = function(app) {
  let Role = app.models.Role;

  Role.registerResolver('acctOwner', function(role, context, cb) {
    if (context.modelName !== 'account') {
      return process.nextTick(() => cb(null, false));
    }

    let userId = context.accessToken.userId;
    if (!userId) {
      return process.nextTick(() => cb(null, false));
    }

    app.models.Person.findById(userId, function(err, person) {
      if(err) {
        return cb(err);
      }
      if(!person) {
        return cb(new Error('No user found by provided token'));
      }

      if (person.accountId === context.modelId) {
        return cb(null, true);
      } else{
        return cb(null, false);
      }
    });
  });
};
