'use strict';

module.exports = function(Person) {

    Person.on('dataSourceAttached', function(obj){
        var create = Person.create;
        Person.create = function(data, context, cb) {
            let that = this;
            let account;

            Person.app.models.Account.create({})
                .then(function(record) {
                    account = record;
                    data.accountId = record.id;
                    return create.apply(that, [data]);
                })
                .then(function(person) {
                    person.account = account;
                    console.log('new person created:', person);
                    cb(null, person);
                })
                .catch(cb);
        };
    });

};
