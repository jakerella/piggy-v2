module.exports = function(app) {
  let Role = app.models.Role;

  Role.registerResolver('acctOwner', function(role, context, cb) {
    let userId = context.accessToken.userId;
    if (!userId) {
      return process.nextTick(() => cb(null, false));
    }

    if (context.modelName !== 'account' || context.modelName !== 'transaction') {
      return process.nextTick(() => cb(null, false));
    }

    app.models.Person.findById(userId, function(err, person) {
      if(err) {
        return cb(err);
      }
      if(!person) {
        return cb(new Error('No user found by provided token'));
      }

      if (context.modelName === 'account' && person.accountId === context.modelId) {
        return cb(null, true);
      } else if (context.modelName === 'transaction' && person.accountId === context.accountId) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  });
};
