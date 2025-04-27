const express = require("express");
const userRouter = express.Router();
const upload = require("../../config/multer");
const bcrypt = require("bcrypt");
const db = require("../../config/database");

userRouter.post("/file-request", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let heading = req.body.heading;
  let description = req.body.description;

  // get today's requested files of user
  db.query(
    "SELECT * FROM file_request WHERE user_id=? AND DATE(created_at)=DATE(NOW())",
    [user_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "error",
            message: "You have already requested file today",
          });
        } else {
          db.query(
            "INSERT INTO file_request (user_id, heading, description, is_seen) VALUES(?,?,?,?)",
            [user_id, heading, description, 0],
            (error, result) => {
              if (!error) {
                res.send({
                  status: "success",
                  message: "Add file request successfully",
                  data: [],
                });
              } else {
                res.send(error);
              }
            }
          );
        }
      }
    }
  );
});

userRouter.post("/personal-content-request", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let request_content = req.body.request_content;

  db.query(
    "INSERT INTO personal_request_content (user_id, request_content) VALUES(?,?)",
    [user_id, request_content],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Add personal request content successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

userRouter.post("/add-message", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;

  db.query(
    "INSERT INTO message (user_id,name,email,message) VALUES(?,?,?,?)",
    [user_id, name, email, message],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Send message successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

// userRouter.get("/get-profile", (req, res) => {
//   let user_id = req.query.user_id;
//   db.query("SELECT * FROM user WHERE user_id=?", [user_id], (error, result) => {
//     if (!error) {
//       db.query(
//         "SELECT * FROM package_enrollment WHERE user_id=?",
//         [user_id],
//         (error1, result1) => {
//           if (!error1) {
//             if (result1.length > 0) {
//               let package_id = result1[0].package_id;
//               db.query(
//                 "SELECT * FROM packages WHERE package_id=?",
//                 [package_id],
//                 (error2, result2) => {
//                   if (!error2) {
//                     res.send({
//                       status: "success",
//                       message: "Get user profile successfully",
//                       package_enrollment: result2,
//                       data: result,
//                     });
//                   } else {
//                     res.send(error2);
//                   }
//                 }
//               );
//             } else {
//               res.send({
//                 status: "success",
//                 message: "Get user profile successfully",
//                 package_enrollment: null,
//                 data: result,
//               });
//             }
//           } else {
//             res.send(error1);
//           }
//         }
//       );
//     } else {
//       res.send(error);
//     }
//   });
// });

userRouter.get("/get-profile", (req, res) => {
  const user_id = req.query.user_id;

  db.query(
    "SELECT * FROM user WHERE user_id = ?",
    [user_id],
    (error, userResult) => {
      if (error) return res.send(error);

      db.query(
        "SELECT * FROM package_enrollment WHERE user_id = ?",
        [user_id],
        (error1, enrollmentResult) => {
          if (error1) return res.send(error1);

          const sendResponse = (
            packageData = null,
            isMultipleDeviceAllowed = null
          ) => {
            res.send({
              status: "success",
              message: "Get user profile successfully",
              package_enrollment: packageData,
              isMultipleDeviceAllowed: isMultipleDeviceAllowed,
              data: userResult,
            });
          };

          // Fetch general_info
          db.query(
            "SELECT general_info.isMultipleDeviceAllowed FROM general_info",
            (error3, result3) => {
              const isMultipleDeviceAllowed =
                !error3 && result3.length > 0
                  ? result3[0].isMultipleDeviceAllowed
                  : null;

              if (enrollmentResult.length > 0) {
                const package_id = enrollmentResult[0].package_id;

                db.query(
                  "SELECT * FROM packages WHERE package_id = ?",
                  [package_id],
                  (error2, packageResult) => {
                    if (error2) return res.send(error2);
                    sendResponse(packageResult, isMultipleDeviceAllowed);
                  }
                );
              } else {
                sendResponse(null, isMultipleDeviceAllowed);
              }
            }
          );
        }
      );
    }
  );
});

userRouter.post("/edit-profile-info", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let name = req.body.name;
  let email = req.body.email;
  let mobile_number = req.body.mobile_number;
  let address = req.body.address;

  db.query(
    "UPDATE user SET user_name=?,user_email=?,user_mobile_number=?,user_address=? WHERE user_id=?",
    [name, email, mobile_number, address, user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update profile info successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

userRouter.post(
  "/edit-profile-photo",
  upload.single("profile_pic"),
  (req, res) => {
    let user_id = req.query.user_id;
    let pic_url = "";
    const imgsrc = req.file ? req.file.filename : "";
    if (imgsrc) {
      pic_url = "https://sfinder.app/upload/" + req.file.filename;
    }

    db.query(
      "UPDATE user SET user_image_url=? WHERE user_id=?",
      [pic_url, user_id],
      (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Update profile picture successfully",
            data: [],
          });
        } else {
          res.send(error);
        }
      }
    );
  }
);

userRouter.post("/change-password", upload.none(), async (req, res) => {
  let user_id = req.query.user_id;
  let password = req.body.password;
  let confirm_password = req.body.confirm_password;

  if (password === confirm_password) {
    let finalPass = await bcrypt.hash(password, 10);
    db.query(
      "UPDATE user SET user_password=? WHERE user_id=?",
      [finalPass, user_id],
      (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Change password successfully",
            data: [],
          });
        } else {
          res.send(error);
        }
      }
    );
  } else {
    res.send({
      status: "failed",
      message: "Confirm password not match",
      data: [],
    });
  }
});

userRouter.get("/my-course", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM course_enrollment LEFT JOIN course as join1 ON 1 LEFT JOIN course_instructor as join2 ON 1 WHERE join1.course_id=course_enrollment.course_id AND join2.course_instructor_id=join1.course_instructor AND course_enrollment.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get my courses successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

userRouter.get("/is-course-enrolled", (req, res) => {
  let user_id = req.query.user_id;
  let course_id = req.query.course_id;
  db.query(
    "SELECT * FROM course_enrollment WHERE user_id=? AND course_id=?",
    [user_id, course_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "success",
            message: "Course already enrolled",
            course_enrolled: 1,
            data: [],
          });
        } else {
          res.send({
            status: "success",
            message: "Course not enrolled",
            course_enrolled: 0,
            data: [],
          });
        }
      } else {
        res.send(error);
      }
    }
  );
});

userRouter.post(
  "/add-user-report",
  upload.array("user_report_photo"),
  (req, res) => {
    let user_id = req.query.user_id;
    let freelancer_id = req.query.freelancer_id;
    let name = req.body.name;
    let subject = req.body.subject;
    let description = req.body.description;
    let pic_url = "";

    db.query(
      "INSERT INTO user_report(user_id,freelancer_id,name,subject,description) VALUES(?,?,?,?,?)",
      [user_id, freelancer_id, name, subject, description],
      (error, result) => {
        if (!error) {
          db.query(
            "SELECT * FROM user_report WHERE user_id=? AND freelancer_id=?",
            [user_id, freelancer_id],
            (error1, result1) => {
              if (!error1) {
                let user_report_id = result1[result1.length - 1].user_report_id;
                for (let i = 0; i < req.files.length; i++) {
                  pic_url =
                    "https://sfinder.app/upload/" + req.files[i].filename;
                  db.query(
                    "INSERT INTO user_report_photo (user_report_id,photo_url) VALUES(?,?)",
                    [user_report_id, pic_url],
                    (error2, result2) => {
                      if (!error2) {
                      } else {
                        res.send(error2);
                      }
                    }
                  );
                }
                res.send({
                  status: "success",
                  message: "Add user report successfully",
                  data: [],
                });
              } else {
                res.send(error1);
              }
            }
          );
        } else {
          res.send(error);
        }
      }
    );
  }
);

userRouter.post("/user-reset", upload.none(), (req, res) => {
  let email = req.query.email;
  let device_id = req.body.device_id;

  db.query(
    "SELECT * FROM user WHERE user_email=?",
    [email],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          let user_id = result[0].user_id;
          db.query(
            "INSERT INTO user_reset(user_id,device_id) VALUES(?,?)",
            [user_id, device_id],
            (error1, result1) => {
              if (!error1) {
                res.send({
                  status: "success",
                  message: "Apply for user reset successfully",
                  data: [],
                });
              } else {
                res.send(error1);
              }
            }
          );
        } else {
          res.send({
            status: "failed",
            message: "No user found with this email address",
            data: [],
          });
        }
      } else {
        res.send(error);
      }
    }
  );
});

module.exports = userRouter;
