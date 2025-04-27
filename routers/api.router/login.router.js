const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcrypt");
const upload = require("../../config/multer");
const db = require("../../config/database");
const { generateOTP } = require("../../utils/helper");
const { mailSend } = require("../../utils/helper");

function queryAsyncWithoutValue(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

loginRouter.post("/login", upload.none(), async (req, res) => {
  let email_address = req.body.email_address;
  let password = req.body.password;
  let device_id = req.body.device_id;

  const generalInfo = await queryAsyncWithoutValue(
    "SELECT * FROM general_info"
  );

  const isMultipleDeviceAllowed =
    generalInfo[0] && generalInfo[0].isMultipleDeviceAllowed;

  db.query(
    "SELECT * FROM user WHERE user_email=?",
    [email_address],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          bcrypt
            .compare(password, result[0].user_password)
            .then((isValidPass) => {
              if (isValidPass) {
                let user_id = result[0].user_id;
                let user_device_id = result[0].device_id;
                let user_login_counter = result[0].login_counter;
                let final_login_counter;
                if (user_device_id == device_id) {
                  db.query(
                    "SELECT * FROM package_enrollment WHERE user_id=?",
                    [user_id],
                    (error1, result1) => {
                      if (!error1) {
                        if (result1.length > 0) {
                          let package_id = result1[0].package_id;
                          db.query(
                            "SELECT * FROM packages WHERE package_id=?",
                            [package_id],
                            (error2, result2) => {
                              if (!error2) {
                                res.send({
                                  status: "success",
                                  message: "Login successful",
                                  package_enrollment: result2,
                                  data: result,
                                  isMultipleDeviceAllowed,
                                });
                              } else {
                                res.send(error2);
                              }
                            }
                          );
                        } else {
                          res.send({
                            status: "success",
                            message: "Login successful",
                            package_enrollment: null,
                            data: result,
                            isMultipleDeviceAllowed,
                          });
                        }
                      } else {
                        res.send(error1);
                      }
                    }
                  );
                } else {
                  final_login_counter = user_login_counter + 1;
                  db.query(
                    "UPDATE user SET login_counter=? WHERE user_id=?",
                    [final_login_counter, user_id],
                    (error3, result3) => {
                      if (!error3) {
                        db.query(
                          "SELECT * FROM package_enrollment WHERE user_id=?",
                          [user_id],
                          (error1, result1) => {
                            if (!error1) {
                              if (result1.length > 0) {
                                let package_id = result1[0].package_id;
                                db.query(
                                  "SELECT * FROM packages WHERE package_id=?",
                                  [package_id],
                                  (error2, result2) => {
                                    if (!error2) {
                                      res.send({
                                        status: "success",
                                        message: "Login successful",
                                        package_enrollment: result2,
                                        data: result,
                                        isMultipleDeviceAllowed,
                                      });
                                    } else {
                                      res.send(error2);
                                    }
                                  }
                                );
                              } else {
                                res.send({
                                  status: "success",
                                  message: "Login successful",
                                  package_enrollment: null,
                                  data: result,
                                  isMultipleDeviceAllowed,
                                });
                              }
                            } else {
                              res.send(error1);
                            }
                          }
                        );
                      } else {
                        res.send(error3);
                      }
                    }
                  );
                }
              } else {
                res.send({
                  status: "failed",
                  message: "Invalid password",
                  data: [],
                });
              }
            });
        } else {
          res.send({
            status: "failed",
            message: "No user found",
            data: [],
          });
        }
      } else {
        res.send(error);
      }
    }
  );
});

// loginRouter.post("/login", upload.none(), (req, res) => {
//   let email_address = req.body.email_address;
//   let password = req.body.password;

//   db.query(
//     "SELECT * FROM user WHERE user_email=?",
//     [email_address],
//     (error, result) => {
//       if (!error) {
//         if (result.length > 0) {
//           bcrypt
//             .compare(password, result[0].user_password)
//             .then((isValidPass) => {
//               if (isValidPass) {
//                 let user_id = result[0].user_id;

//                 db.query(
//                   "SELECT * FROM package_enrollment WHERE user_id=?",
//                   [user_id],
//                   (error1, result1) => {
//                     if (!error1) {
//                       if (result1.length > 0) {
//                         let package_id = result1[0].package_id;
//                         db.query(
//                           "SELECT * FROM packages WHERE package_id=?",
//                           [package_id],
//                           (error2, result2) => {
//                             if (!error2) {
//                               res.send({
//                                 status: "success",
//                                 message: "Login successful",
//                                 package_enrollment: result2,
//                                 data: result,
//                               });
//                             } else {
//                               res.send(error2);
//                             }
//                           }
//                         );
//                       } else {
//                         res.send({
//                           status: "success",
//                           message: "Login successful",
//                           package_enrollment: null,
//                           data: result,
//                         });
//                       }
//                     } else {
//                       res.send(error1);
//                     }
//                   }
//                 );
//               } else {
//                 res.send({
//                   status: "failed",
//                   message: "Invalid password",
//                   data: [],
//                 });
//               }
//             });
//         } else {
//           res.send({
//             status: "failed",
//             message: "No user found",
//             data: [],
//           });
//         }
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

loginRouter.get("/send-otp", upload.none(), (req, res) => {
  const { email_address } = req.query;
  console.log(email_address);

  db.query(
    "SELECT * FROM user WHERE user_email=?",
    [email_address],
    async (error, result) => {
      console.log(result);
      if (error) {
        return res.send({ status: "error", message: "Database error", error });
      }
      if (result.length === 0) {
        return res.send({ status: "failed", message: "No user found" });
      }

      // Generate OTP
      const otp = generateOTP();

      // Save OTP temporarily (e.g., in Redis or database)
      db.query(
        "UPDATE user SET otp=? WHERE user_email=?",
        [otp, email_address],
        async (updateError) => {
          if (updateError) {
            return res.send({
              status: "error",
              message: "Failed to save OTP",
              error: updateError,
            });
          }

          // Send OTP email
          try {
            await mailSend(email_address, otp, "Password Reset OTP");
            res.send({
              status: "success",
              message: "OTP sent to your email address. Please verify.",
            });
          } catch (emailError) {
            res.send({
              status: "error",
              message: "Failed to send OTP email",
              error: emailError,
            });
          }
        }
      );
    }
  );
});

loginRouter.post("/forget-password", upload.none(), (req, res) => {
  const { email_address, otp, password, confirm_password } = req.body;

  db.query(
    "SELECT * FROM user WHERE user_email=? AND otp=?",
    [email_address, otp],
    async (error, result) => {
      if (error) {
        return res.send({ status: "error", message: "Database error", error });
      }
      if (result.length === 0) {
        return res.send({
          status: "failed",
          message: "Invalid OTP or email address",
        });
      }

      if (password !== confirm_password) {
        return res.send({
          status: "failed",
          message: "Password and Confirm Password do not match",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password
      db.query(
        "UPDATE user SET user_password=?, otp=NULL WHERE user_email=?",
        [hashedPassword, email_address],
        (updateError) => {
          if (updateError) {
            return res.send({
              status: "error",
              message: "Failed to update password",
              error: updateError,
            });
          }

          res.send({
            status: "success",
            message: "Password reset successfully",
          });
        }
      );
    }
  );
});

module.exports = loginRouter;
