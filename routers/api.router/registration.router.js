const express = require("express");
const registrationRouter = express.Router();
const upload = require("../../config/multer");
const bcrypt = require("bcrypt");
const db = require("../../config/database");

registrationRouter.post("/user-registration", upload.none(), (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let mobile_number = req.body.mobile_number;
  let address = req.body.address;
  let password = req.body.password;
  let confirm_password = req.body.confirm_password;
  let device_id = req.body.device_id;

  db.query(
    "SELECT * FROM user WHERE user_email=?",
    [email],
    async (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "failed",
            message: "Already have user with this email.",
            data: [],
          });
        } else {
          if (password == confirm_password) {
            let finalPass = await bcrypt.hash(password, 10);
            db.query(
              "INSERT INTO user(user_name,user_email,user_mobile_number,user_address,user_password,user_verification,device_id) VALUES(?,?,?,?,?,?,?)",
              [name, email, mobile_number, address, finalPass, 1, device_id],
              (error1, result1) => {
                if (!error1) {
                  db.query(
                    "SELECT * FROM user WHERE user_email=?",
                    [email],
                    (error2, result2) => {
                      if (!error2) {
                        res.send({
                          status: "success",
                          message: "Add a user successfully",
                          data: result2,
                        });
                      } else {
                        res.send(error2);
                      }
                    }
                  );
                } else {
                  res.send(error1);
                }
              }
            );
          } else {
            res.send({
              status: "failed",
              message: "Confirm password not match.",
              data: [],
            });
          }
        }
      } else {
        res.send(error);
      }
    }
  );
});

module.exports = registrationRouter;
