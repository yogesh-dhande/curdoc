const { log } = require('../util/util');

const createUser = (db, user) => {
    log('Start adding data to user ');
    db.collection("users").doc(user.uid).set({
        id: user.uid,
        email: {
            [user.email]: {
                verified: !!user.email
            },
        },
        address: "",
        name: "",
        phoneNumber: {},
        birthday: "dd/MM/yyyy",
        profile_pic_url: ""
    }).then( () => {
        log("Written to users collection user: " + user.email);
        return null;
    }).catch( error => {
        log("Error adding user to user collection" + error)
    });
};

module.exports = {
    createUser
};
