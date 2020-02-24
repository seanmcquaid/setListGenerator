const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");

exports.postRegister = async (req, res, next) => {
    const {username, password, selectedBandleader} = req.body;
    const {accountType} = req.params;

    return await UserModel.userExists(username)
            .then(async userInfo => {
                if(userInfo.length > 0){
                    return await res.status(401).send({
                        errorMessage : "This user has already been registered"
                    });
                }

                return await UserModel.register(username, password, accountType, selectedBandleader)
                        .then(async userInfoResponse => {

                            const specificUserInfo = userInfoResponse[0];

                            const {id, username, accounttype, setlistavailable, bandleadername} = specificUserInfo;

                            const token = await jwt.sign(
                                {
                                    id : id,
                                    username : username,
                                    accountType : accounttype
                                },
                                config.jwtSecret,
                                {expiresIn : 3600000}
                            );

                            return await res.status(200).send({
                                isAuthenticated : true,
                                token,
                                username : username,
                                accountType : accounttype,
                                setListAvailable : setlistavailable,
                                selectedBandleader : bandleadername,
                            });
                        })
            })
            .catch(err => console.log(err));
};

exports.postLogin = async (req, res, next) => {
    const {username, password} = req.body;
    const {accountType} = req.params;

    return await UserModel.userExists(username)
            .then(async userInfo => {
                if(userInfo.length == 0){
                    return await res.status(401).send({
                        errorMessage : "This user isn't registered on our site!"
                    });
                }

                const specificUserInfo = userInfo[0];

                const {id, username, accounttype, setlistavailable, bandleadername} = specificUserInfo;

                if(specificUserInfo.accounttype !== accountType){
                    return await res.status(401).send({
                        errorMessage : "Wrong account type for this user!"
                    });
                }

                return await bcrypt.compare(password, specificUserInfo.password)
                            .then(async isMatch => {
                                if(!isMatch){
                                    return await res.status(401).send({
                                        errorMessage : "Entered password doesn't match our records"
                                    });
                                }

                                const token = await jwt.sign(
                                    {
                                        id : id,
                                        username : username,
                                        accountType : accounttype,
                                    },
                                    config.jwtSecret,
                                    {expiresIn : 3600000}
                                );
                
                                return await res.status(200).send({
                                    isAuthenticated : true,
                                    token,
                                    username : username,
                                    accountType : accounttype,
                                    setListAvailable : setlistavailable,
                                    selectedBandleader : bandleadername,
                                });
                            });
            })
            .catch(err => console.log(err))
};

exports.getCheckToken = (req,res,next) => {
    const token = req.token;
    const {username} = token;

    return UserModel.userExists(username)
            .then(userInfo => {
                const specificUserInfo = userInfo[0];

                const {id, accounttype, setlistavailable, bandleadername} = specificUserInfo;

                const newToken = jwt.sign(
                    {
                        id : id,
                        username : specificUserInfo.username,
                        accountType : accounttype
                    },
                    config.jwtSecret,
                    {expiresIn : 3600000}
                );

                return res.status(200).send({
                    isAuthenticated : true,
                    token : newToken,
                    username : username,
                    accountType : accounttype,
                    setListAvailable : setlistavailable,
                    selectedBandleader : bandleadername,
                });
            })
            .catch(err => {
                req.token = null;
                return res.status(401).send({
                    errorMessage : "Issue with creating a new token, please login again"
                })
            });


};

exports.getBandleaders = (req, res, next) => {
    return UserModel.getAllBandleaders()
                .then(response => {
                    return res.status(200).send({
                        bandLeaders : response
                    })
                })
                .catch(err => console.log(err));
};

exports.getClientsForBandLeader = (req, res, next) => {
    const token = req.token;
    const {username} = token;

    return UserModel.getClientsForBandleader(username)
                    .then(response => {
                        return res.status(200).send({
                            clientList : response
                        })
                    })
                    .catch(err => console.log(err));
};

exports.getUserInfo = (req, res, next) => {
    const token = req.token;
    const {id} = token;

    return UserModel.getUserInfo(id)
                    .then(response => {
                        return res.status(200).send({
                            userInfo : response[0]
                        })
                    })
                    .catch(err => console.log(err));
};

exports.getClientInfo = (req, res, next) => {
    const {clientId} = req.params;

    return UserModel.getUserInfo(clientId)
                    .then(response => {
                        return res.status(200).send({
                            clientInfo : response[0],
                        })
                    })
                    .catch(err => console.log(err));

};

exports.editUserInfo = async (req, res, next) => {
    const {id} = req.token;
    const {newUsername, newPassword} = req.body;

    await UserModel.getUserInfo(id)
            .then(async response => {
                // circle back and add functionality to check new username against DB
                const userInfo = response[0];
                await bcrypt.compare(newPassword, userInfo.password)
                    .then(isMatch => {
                        console.log(isMatch)
                        if(isMatch){
                            return res.status(401).send({
                                errorMessage : "The new password is presently being used"
                            });
                        }
                    })

                return await UserModel.editUserInfo(newUsername, newPassword, id)
                        .then(response => {
                            const specificUserInfo = response[0];
                            
                            const newToken = jwt.sign(
                                {
                                    id : specificUserInfo.id,
                                    username : specificUserInfo.username,
                                    accountType : specificUserInfo.accounttype
                                },
                                config.jwtSecret,
                                {expiresIn : 3600000}
                            );

                            return res.status(200).send({
                                isAuthenticated : true,
                                token : newToken,
                                username : specificUserInfo.username,
                                accountType : specificUserInfo.accounttype
                            });
                        })

            })
            .catch(err => console.log(err));

};

exports.sendClientSetlist = (req, res, next) => {
    const token = req.token;
    const {username} = token;
    const {setlistAvailability} = req.body;

    UserModel.setClientSetlistAvailability(username, setlistAvailability)
            .then(response => {
                console.log(response[0].setlistavailable)
                return res.status(200).send({
                    setListAvailable : response[0].setlistavailable,
                });
            })
            .catch(err => console.log(err));

};