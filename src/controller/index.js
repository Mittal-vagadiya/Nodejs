const expressAsyncHandler = require('express-async-handler')
const UserModel = require('../model/UserModel');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const receiverPhoneNumber = process.env.RECEIVER_PHONE_NUMBER;

const register = expressAsyncHandler(async (req, res) => {
        const email = req.body.email;
        const findUser = await UserModel.findOne({ email: email });
        if (!findUser) {
                const newUser = await UserModel.create(req.body);
                res.status(200).json({ messgae: "User Created Successfully", User: newUser });
        }
        res.status(400);
        throw new Error("User Already Registered");
})

const login = expressAsyncHandler(async (req, res) => {
        try {
                const { email, password } = req.body;
                const findUser = await UserModel.findOne({ email });

                if (findUser && (await findUser.isPasswordMatched(password))) {
                        const refreshToken = await generateRefreshToken(findUser?._id)
                        const updateUser = await UserModel.findByIdAndUpdate(findUser?._id,
                                { refreshToken: refreshToken },
                                { new: true }
                        )
                        res.cookie("refreshToken", refreshToken, {
                                httpOnly: true,
                                maxAge: 24 * 60 * 60 * 1000,
                        });
                        res.status(200).json({
                                _id: findUser._id,
                                firstname: findUser.firstname,
                                lastname: findUser.lastname,
                                email: findUser.email,
                                mobile: findUser.mobile,
                                token: generateToken(findUser._id),
                                refreshToken: findUser.refreshToken
                        });
                } else {
                        throw new Error("Invalid Credentials or User is Blocked");
                }
        } catch (error) {
                res.status(400).json({ message: error.message });
        }
})

const optSender = expressAsyncHandler(async (req, res) => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        try {
                const userMobile = await UserModel.findById(req.user.id);
                const receiver = userMobile?.mobile;
                const client = require('twilio')(accountSid, authToken);
                await client.messages.create({
                        body: `Your OTP is: ${otp}`,
                        from: twilioPhoneNumber,
                        to: receiver,
                });
                const user = await UserModel.findByIdAndUpdate(
                        req.user.id,
                        {
                                otp: otp,
                                otpExpiration: new Date(Date.now() + 5 * 60 * 1000), // Set OTP expiration time (5 minutes from now)
                        },
                        { new: true }
                );

                setTimeout(() => {
                        user.otp = "";
                        user.otpExpiration = undefined;
                        user.save();
                }, 5 * 60 * 1000);

                res.status(200).json({
                        message: 'OTP sent successfully', user: {
                                _id: user.id,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                mobile: user.mobile,
                        }
                });
        } catch (error) {
                res.status(500).json({ message: 'Failed to send OTP', error });
        }
});


const verify = expressAsyncHandler(async (req, res) => {
        const { otp } = req.body
        console.log('otp', otp)
        try {
                const user = await UserModel.findById(req.user.id)
                console.log('user', user)
                if (user.otp == otp) {
                        res.json("otp matched successfully")
                } else {
                        res.json("otp does not matched successfully")
                }
        } catch (error) {
                res.json(error)
        }
})

const refreshCookie = expressAsyncHandler(async (req, res) => {
        try {
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) throw new Error('No Refresh Token in Cookies')
                const user = await UserModel.findOne({ refreshToken })
                if (!user) throw new Error(" No Refresh token present in db or not matched");
                const accessToken = generateToken(user?._id);
                res.status(200).json(accessToken);

        } catch (err) {
                res.status(200).json(err)
        }
})

const getAllUser = expressAsyncHandler(async (req, res) => {
        try {
                const getUsers = await UserModel.find();
                res.status(200).json(getUsers);
        } catch (error) {
                res.status(400)
                throw new Error(error);
        }
})

const getUserById = expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        try {
                const findUser = await UserModel.findById(id)
                res.status(200).json(findUser)
        } catch {
                res.status(400)
                throw new Error("User Not Found")
        }
})

const updateUser = expressAsyncHandler(async (req, res) => {
        try {
                const updatedUser = await UserModel.findByIdAndUpdate(
                        req.user.id,
                        {
                                firstname: req?.body?.firstname,
                                lastname: req?.body?.lastname,
                                email: req?.body?.email,
                                mobile: req?.body?.mobile,
                        },
                        {
                                new: true,
                        }
                );
                res.status(200).json(updatedUser);
        } catch (error) {
                res.status(400)
                throw new Error(error);
        }
})
const deleteUser = expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        try {
                const findUser = await UserModel.findByIdAndDelete(id)
                res.status(200).json(findUser)
        } catch {
                res.send(400)
                throw new Error("User Not Found")
        }

})

const blockUser = expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        try {

                const blockedUser = await UserModel.findByIdAndUpdate({ _id: id },
                        { $set: { isblocked: true } },
                        { new: true }
                );
                res.status(200).json(blockedUser);
        } catch (error) {
                res.status(400).json({ message: 'Failed to block user', error });
        }
})
const unblockUser = expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        try {
                const unblockUser = await UserModel.findByIdAndUpdate(id, {
                        isblocked: false
                }, { new: true })
                res.status(200).json(unblockUser);
        } catch (error) {
                res.status(400).json({ message: 'Failed to Unblock user', error });
        }
})
        
module.exports = { register, login, getAllUser, getUserById, deleteUser, updateUser, blockUser, unblockUser, refreshCookie, optSender, verify }