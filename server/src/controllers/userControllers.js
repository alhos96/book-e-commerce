const { User } = require("../models/userModel");
const config = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  //check username
  if (username !== "admin") {
    let existingUser = await User.findOne({ username: username.trim() });

    if (!existingUser) {
      let error = new Error("User with that name doesn't exist.");
      res.status(400).json({ message: "User with that name doesn't exist." });

      return next(error);
    }

    //check password

    let enteredPassword;

    try {
      enteredPassword = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
      console.log(error);
      return next(error);
    }

    if (!enteredPassword) {
      let error = new Error("Wrong password!");
      res.status(400).json({ message: "Wrong password!" });

      return next(error);
    }

    //send token

    let { email, role, member } = existingUser;

    let token = jwt.sign({ username, email, member, role }, config.secret);

    res.status(201).json({ token });

    console.log(`user logged in as ${username}`);
  } else {
    let token = jwt.sign({ role: "admin" }, config.secret);

    res.status(201).json({ token });

    console.log(`user logged in as ${username}`);
  }
};

exports.register = async (req, res, next) => {
  const { username, email, password, address, state, city, zipcode, member } = req.body;

  let existingName = await User.findOne({ username });

  if (existingName) {
    res.status(400).json({ message: "User with that name already exists." });
    const error = new Error("User with that name already exists");
    return next(error);
  }

  let existingEmail = await User.findOne({ email });

  if (existingEmail) {
    res.status(400).json({ message: "User with that email already exists." });
    const error = new Error("User with that email already exists");
    return next(error);
  }

  let hashedPassword = await bcrypt.hash(password, 12);

  let newUser = new User({
    username,
    email,
    address,
    state,
    city,
    zipcode,
    member,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(200).json({ newUser });
};
