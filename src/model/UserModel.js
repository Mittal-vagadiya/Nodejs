const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            set: function (value) {
                return "+91" + value;
            },
        },
            password: {
                type: String,
                required: true,
            },
            isAdmin: {
                type: String,
                default: "user"
            },
            cart: {
                type: Array,
                default: []
            },
            isblocked: {
                type: Boolean,
                default: false
            },
            address: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address"
            }],
            wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
            refreshToken: {
                type: String,
            },
            otp: {
                type: Number
            }
        },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
