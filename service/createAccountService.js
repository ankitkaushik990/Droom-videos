const User = require("../Model/userModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASS,
  },
});

// Function to generate a password based on user details
const generatePassword = (firstName, lastName, email, number) => {
  const emailLocalPart = email.split("@")[0];
  const numberPart = number.toString().slice(-2);
  let password =
    firstName.charAt(0) +
    lastName.charAt(0) +
    emailLocalPart.slice(0, 2) +
    numberPart;
  if (password.length < 6) {
    password = (password + emailLocalPart).slice(0, 6);
  } else {
    password = password.slice(0, 6);
  }

  return password;
};

// Function to send email
const sendEmail = (email, firstName, lastName, password) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "itstestpurposemail1@gmail.com",
      to: email,
      subject: "Welcome to Loom Recording",
      html: `<p>Thank you for creating your account, ${firstName} ${lastName}!</p><p>Your password to login is: ${password}</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
};

// Function to create account in service
exports.createAccountInService = async (firstName, lastName, email, number) => {
  try {
    const password = generatePassword(firstName, lastName, email, number);

    const user = new User({ firstName, lastName, email, number, password });

    // Save user into the database
    await user.save();

    await sendEmail(email, firstName, lastName, password);

    return;
  } catch (error) {
    console.error("Error creating account and sending email:", error);
    if (error.message.includes("duplicate key error")) {
      throw new Error("User already exists");
    } else if (error.message.includes("validation failed")) {
      throw new Error("Validation Error !, please check details");
    } else {
      throw new Error("Failed ! please check details and try Again !");
    }
  }
};

exports.updateUserBio = async (userId, bio) => {
  try {
    // Find user by ID and update bio
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found or unable to update bio");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
