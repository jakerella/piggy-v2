'use strict';

module.exports = function(Transaction) {

    Transaction.on('dataSourceAttached', function(obj){
        var find = Transaction.find;
        Transaction.find = function(filter, context, cb) {
            if (!context || !context.accessToken) {
                let err = new Error('You must be logged in to see transactions');
                err.status = 401;
                return cb(err);
            }
            
            Transaction.app.models.Person.findById(context.accessToken.userId, function(err, person) {
                if (err) {
                    return cb(err);
                } else if (!person) {
                    let err = new Error('Unable to locate user account');
                    err.status = 403;
                    return cb(err);
                } else if (!person.accountId) {
                    console.error('No account attached to person:', context.accessToken.userId);
                    return cb(null, []);
                }

                if (!filter) {
                    filter = { where: { accountId: person.accountId } };
                } else {
                    filter.where = { and: [ { accountId: person.accountId }, filter.where ] };
                }
                console.log('added account filter:', filter);

                return find.apply(this, [filter, context, cb]);
            });
        };
    });

};
