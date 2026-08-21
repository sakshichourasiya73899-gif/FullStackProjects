import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:false,
            trim:true,
            lowercase:true,
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        password:{
        type:String,

        },
    },
    {timestapms:true}
)

// Password hash karo, sirf jab woh modify/naya ho
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Plain password ko hashed password se compare karo (login ke waqt)
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Short-lived access token generate karo
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};

// Long-lived refresh token generate karo
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
  );
};

export const User = mongoose.model("User",userSchema)