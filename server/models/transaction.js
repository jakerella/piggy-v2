'use strict';

module.exports = function(Transaction) {

    Transaction.on('dataSourceAttached', function() {
        setupFindFilter();
        setupAccountAttachment();
    });

    function findAccountIdForPerson(id) {
        return Transaction.app.models.Person.findById(id)
            .then(function(person) {
                if (!person) {
                    let err = new Error('Unable to locate user account');
                    err.status = 403;
                    throw err;
                } else if (!person.accountId) {
                    console.error('No account attached to person:', id);
                    let err = new Error('No account for user');
                    err.status = 403;
                    throw err;
                }
                return person.accountId;
            });
    }

    function setupFindFilter() {
        var find = Transaction.find;
        Transaction.find = function(filter, context, cb) {
            let that = this;

            if (!context || !context.accessToken) {
                let err = new Error('You must be logged in to see transactions');
                err.status = 401;
                return cb(err);
            }

            return findAccountIdForPerson(context.accessToken.userId)
                .then(function(accountId) {
                    if (!filter) {
                        filter = { where: { accountId: accountId } };
                    } else {
                        filter.where = { and: [ { accountId: accountId }, filter.where ] };
                    }
                    console.log('added account filter:', JSON.stringify(filter));

                    return find.apply(that, [filter, context, cb]);
                })
                .catch(cb);
        };
    }

    function setupAccountAttachment() {
        var create = Transaction.create;
        Transaction.create = function(data, context, cb) {
            let that = this;

            if (!context || !context.accessToken) {
                let err = new Error('You must be logged in to create transactions');
                err.status = 401;
                return cb(err);
            }

            return findAccountIdForPerson(context.accessToken.userId)
                .then(function(accountId) {
                    data.accountId = accountId;
                    return create.apply(that, [data, context, cb]);
                })
                .catch(cb);
        };
    }

};
