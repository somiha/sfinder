const express = require("express");
const freelancerRouter = express.Router();
const upload = require("../../config/multer");
let moment = require("moment");
const db = require("../../config/database");

const queryAsync = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return reject(error); // Reject the promise with the error
      }
      resolve(result); // Resolve the promise with the query result
    });
  });
};
freelancerRouter.post(
  "/add-freelancer",
  upload.fields([
    { name: "nid_front", maxCount: 1 },
    { name: "nid_back", maxCount: 1 },
    { name: "parent_death_cerificate_front", maxCount: 1 },
    { name: "parent_death_cerificate_back", maxCount: 1 },
    { name: "passport_front", maxCount: 1 },
    { name: "passport_back", maxCount: 1 },
    { name: "profile_photo", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  (req, res) => {
    let user_id = req.query.user_id;
    let name = req.body.name;
    let info = req.body.info;
    let working_area = req.body.working_area;
    let experience = req.body.experience;
    let specialist = req.body.specialist;
    let qualification = req.body.qualification;
    let country = req.body.country;
    let working_time = req.body.working_time;
    let availability = req.body.availability;
    let primary_language = req.body.primary_language;
    let secondary_language = req.body.secondary_language;
    let curr_date = moment().format("DD-MM-YYYY");
    let nid_front_url = "";
    let nid_back_url = "";
    let parent_death_cerificate_front_url = "";
    let parent_death_cerificate_back_url = "";
    let passport_front_url = "";
    let passport_back_url = "";
    let profile_pic_url = "";
    let cover_photo_url = "";
    if (req.files.passport_front) {
      profile_pic_url =
        "https://sfinder.app/upload/" + req.files.profile_photo[0].filename;
      cover_photo_url =
        "https://sfinder.app/upload/" + req.files.cover_photo[0].filename;
      nid_front_url =
        "https://sfinder.app/upload/" + req.files.nid_front[0].filename;
      nid_back_url =
        "https://sfinder.app/upload/" + req.files.nid_back[0].filename;
      parent_death_cerificate_front_url =
        "https://sfinder.app/upload/" +
        req.files.parent_death_cerificate_front[0].filename;
      parent_death_cerificate_back_url =
        "https://sfinder.app/upload/" +
        req.files.parent_death_cerificate_back[0].filename;
      passport_front_url =
        "https://sfinder.app/upload/" + req.files.passport_front[0].filename;
      passport_back_url =
        "https://sfinder.app/upload/" + req.files.passport_back[0].filename;
    } else if (req.files) {
      profile_pic_url =
        "https://sfinder.app/upload/" + req.files.profile_photo[0].filename;
      cover_photo_url =
        "https://sfinder.app/upload/" + req.files.cover_photo[0].filename;
      nid_front_url =
        "https://sfinder.app/upload/" + req.files.nid_front[0].filename;
      nid_back_url =
        "https://sfinder.app/upload/" + req.files.nid_back[0].filename;
      parent_death_cerificate_front_url =
        "https://sfinder.app/upload/" +
        req.files.parent_death_cerificate_front[0].filename;
      parent_death_cerificate_back_url =
        "https://sfinder.app/upload/" +
        req.files.parent_death_cerificate_back[0].filename;
    }

    db.query(
      "SELECT * FROM freelancer WHERE user_id=?",
      [user_id],
      (error1, result1) => {
        if (!error1) {
          if (result1.length > 0) {
            res.send({
              status: "failed",
              message: "Already registered with this user",
              data: [],
            });
          } else {
            db.query(
              "INSERT INTO freelancer(user_id,freelancer_name,freelancer_info,freelancer_working_area,freelancer_experience,freelancer_specialist,freelancer_qualification,freelancer_country,freelancer_working_time,freelancer_availability,freelancer_joined_date,freelancer_acc_status,freelancer_nid_front_image_url,freelancer_nid_back_image_url,freelancer_parents_death_certification_front_image_url,freelancer_parents_death_certification_back_image_url,freelancer_passport_front_image_url,freelancer_passport_back_image_url,freelancer_profile_pic,freelancer_cover_photo,primary_language,secondary_language) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                user_id,
                name,
                info,
                working_area,
                experience,
                specialist,
                qualification,
                country,
                working_time,
                availability,
                curr_date,
                -1,
                nid_front_url,
                nid_back_url,
                parent_death_cerificate_front_url,
                parent_death_cerificate_back_url,
                passport_front_url,
                passport_back_url,
                profile_pic_url,
                cover_photo_url,
                primary_language,
                secondary_language,
              ],
              (error, result) => {
                if (!error) {
                  res.send({
                    status: "success",
                    message: "Add freelancer successfully",
                    data: [],
                  });
                } else {
                  res.send(error);
                }
              }
            );
          }
        } else {
          res.send(error1);
        }
      }
    );
  }
);

freelancerRouter.post(
  "/edit-freelancer-profile",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  (req, res) => {
    let user_id = req.query.user_id;
    let name = req.body.name;
    let info = req.body.info;
    let working_area = req.body.working_area;
    let experience = req.body.experience;
    let specialist = req.body.specialist;
    let qualification = req.body.qualification;
    let country = req.body.country;
    let primary_language = req.body.primary_language;
    let secondary_language = req.body.secondary_language;
    let working_time = req.body.working_time;
    let availability = req.body.availability;
    let profile_pic_url = "";
    let cover_photo_url = "";

    if (req.files.profile_photo) {
      profile_pic_url =
        "https://sfinder.app/upload/" + req.files.profile_photo[0].filename;
      db.query(
        "UPDATE freelancer SET freelancer_name=?,freelancer_info=?,freelancer_working_area=?,freelancer_experience=?,freelancer_specialist=?,freelancer_qualification=?,freelancer_country=?,freelancer_working_time=?,freelancer_availability=?,freelancer_profile_pic=?, primary_language = ?, secondary_language = ? WHERE user_id=?",
        [
          name,
          info,
          working_area,
          experience,
          specialist,
          qualification,
          country,
          working_time,
          availability,
          profile_pic_url,
          primary_language,
          secondary_language,
          user_id,
        ],
        (error, result) => {
          if (!error) {
            res.send({
              status: "success",
              message: "Edit freelancer profile successfully",
              data: [],
            });
          } else {
            res.send(error);
          }
        }
      );
    } else if (req.files.cover_photo) {
      cover_photo_url =
        "https://sfinder.app/upload/" + req.files.cover_photo[0].filename;
      db.query(
        "UPDATE freelancer SET freelancer_name=?,freelancer_info=?,freelancer_working_area=?,freelancer_experience=?,freelancer_specialist=?,freelancer_qualification=?,freelancer_country=?,freelancer_working_time=?,freelancer_availability=?,freelancer_cover_photo=?, primary_language = ?, secondary_language = ? WHERE user_id=?",
        [
          name,
          info,
          working_area,
          experience,
          specialist,
          qualification,
          country,
          working_time,
          availability,
          cover_photo_url,
          primary_language,
          secondary_language,
          user_id,
        ],
        (error, result) => {
          if (!error) {
            res.send({
              status: "success",
              message: "Edit freelancer profile successfully",
              data: [],
            });
          } else {
            res.send(error);
          }
        }
      );
    } else if (req.files.profile_photo && req.files.cover_photo) {
      profile_pic_url =
        "https://sfinder.app/upload/" + req.files.profile_photo[0].filename;
      cover_photo_url =
        "https://sfinder.app/upload/" + req.files.cover_photo[0].filename;
      db.query(
        "UPDATE freelancer SET freelancer_name=?,freelancer_info=?,freelancer_working_area=?,freelancer_experience=?,freelancer_specialist=?,freelancer_qualification=?,freelancer_country=?,freelancer_working_time=?,freelancer_availability=?,freelancer_profile_pic=?,freelancer_cover_photo=?, primary_language = ?, secondary_language = ? WHERE user_id=?",
        [
          name,
          info,
          working_area,
          experience,
          specialist,
          qualification,
          country,
          working_time,
          availability,
          profile_pic_url,
          cover_photo_url,
          primary_language,
          secondary_language,
          user_id,
        ],
        (error, result) => {
          if (!error) {
            res.send({
              status: "success",
              message: "Edit freelancer profile successfully",
              data: [],
            });
          } else {
            res.send(error);
          }
        }
      );
    } else {
      db.query(
        "UPDATE freelancer SET freelancer_name=?,freelancer_info=?,freelancer_working_area=?,freelancer_experience=?,freelancer_specialist=?,freelancer_qualification=?,freelancer_country=?,freelancer_working_time=?,freelancer_availability=?, primary_language = ?, secondary_language = ? WHERE user_id=?",
        [
          name,
          info,
          working_area,
          experience,
          specialist,
          qualification,
          country,
          working_time,
          availability,
          primary_language,
          secondary_language,
          user_id,
        ],
        (error, result) => {
          if (!error) {
            res.send({
              status: "success",
              message: "Edit freelancer profile successfully",
              data: [],
            });
          } else {
            res.send(error);
          }
        }
      );
    }
  }
);

// freelancerRouter.get("/get-freelancers", (req, res) => {
//   let specialist_id = req.query.specialist_id;
//   if (specialist_id == 1) {
//     db.query(
//       "SELECT * FROM freelancer INNER JOIN user ON user.user_id=freelancer.user_id WHERE (freelancer_specialist=? OR freelancer_specialist=?) AND freelancer_acc_status IN(0, 1)",
//       ["Software", "Both"],
//       (error, result) => {
//         if (!error) {
//           res.send({
//             status: "success",
//             message: "Get freelancers successfully",
//             data: result,
//           });
//         } else {
//           res.send(error);
//         }
//       }
//     );
//   } else {
//     db.query(
//       "SELECT * FROM freelancer INNER JOIN user ON user.user_id=freelancer.user_id WHERE (freelancer_specialist=? OR freelancer_specialist=?) AND freelancer_acc_status IN(0, 1)",
//       ["Hardware", "Both"],
//       (error, result) => {
//         if (!error) {
//           res.send({
//             status: "success",
//             message: "Get freelancers successfully",
//             data: result,
//           });
//         } else {
//           res.send(error);
//         }
//       }
//     );
//   }
// });

freelancerRouter.get("/get-freelancers", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 30; // Items per page
  const offset = (page - 1) * limit;
  const specialist_id = req.query.specialist_id;

  const specialistFilter =
    specialist_id == 1 ? ["Software", "Both"] : ["Hardware", "Both"];

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM freelancer 
    INNER JOIN user ON user.user_id = freelancer.user_id 
    WHERE (freelancer_specialist = ? OR freelancer_specialist = ?) 
    AND freelancer_acc_status IN (0, 1)
  `;

  const dataQuery = `
    SELECT * 
    FROM freelancer 
    INNER JOIN user ON user.user_id = freelancer.user_id 
    WHERE (freelancer_specialist = ? OR freelancer_specialist = ?) 
    AND freelancer_acc_status IN (0, 1)
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, specialistFilter, (error, countResult) => {
    if (!error) {
      const totalPages = Math.ceil(countResult[0].total / limit);
      db.query(
        dataQuery,
        [...specialistFilter, limit, offset],
        (error, result) => {
          if (!error) {
            res.send({
              status: "success",
              message: "Get freelancers successfully",
              page,
              limit,
              totalPages,
              data: result,
            });
          } else {
            res.send(error);
          }
        }
      );
    } else {
      res.send(error);
    }
  });
});

freelancerRouter.get("/freelancer-profile", (req, res) => {
  let freelancer_id = req.query.freelancer_id;
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM freelancer INNER JOIN user ON user.user_id=freelancer.user_id WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM freelancer_conversation WHERE user_id=? AND freelancer_id=?",
          [user_id, freelancer_id],
          (error1, result1) => {
            if (!error1) {
              if (result1.length > 0) {
                let convo_id = result1[0].convo_id;
                res.send({
                  status: "success",
                  message: "Get freelancer profile successfully",
                  convo_id: convo_id,
                  data: result,
                });
              } else {
                res.send({
                  status: "success",
                  message: "Get freelancer profile successfully",
                  convo_id: null,
                  data: result,
                });
              }
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
});

freelancerRouter.post(
  "/add-freelancer-chat",
  upload.single("file"),
  (req, res) => {
    let user_id = req.query.user_id;
    let freelancer_id = req.query.freelancer_id;
    let message = req.body.message;
    let is_user = req.body.is_user;
    let message_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");
    let message_time = moment().utcOffset("GMT+06:00").format("LT");
    let file_url = "";
    let file_type = req.body.file_type;
    const filesrc = req.file ? req.file.filename : "";
    if (filesrc) {
      file_url = "https://sfinder.app/upload/" + req.file.filename;
      db.query(
        "SELECT * FROM freelancer_bid WHERE user_id=? AND freelancer_id=?",
        [user_id, freelancer_id],
        (error, result) => {
          if (!error) {
            if (result.length > 0) {
              let bid_id = result[0].freelancer_bid_id;
              db.query(
                "INSERT INTO freelancer_message(user_id,freelancer_id,bid_id,file,file_type,is_user,date,time) VALUES(?,?,?,?,?,?,?,?)",
                [
                  user_id,
                  freelancer_id,
                  bid_id,
                  file_url,
                  file_type,
                  is_user,
                  message_date,
                  message_time,
                ],
                (error1, result1) => {
                  if (!error1) {
                    db.query(
                      "SELECT * FROM freelancer_message WHERE bid_id=?",
                      [bid_id],
                      (error2, result2) => {
                        if (!error2) {
                          res.send({
                            status: "success",
                            message: "Add message successfully",
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
              db.query(
                "INSERT INTO freelancer_bid(user_id,freelancer_id) VALUES(?,?)",
                [user_id, freelancer_id],
                (error, result) => {
                  if (!error) {
                    db.query(
                      "SELECT * FROM freelancer_bid WHERE user_id=? AND freelancer_id=?",
                      [user_id, freelancer_id],
                      (error3, result3) => {
                        if (!error3) {
                          let bid_id = result3[0].freelancer_bid_id;
                          db.query(
                            "INSERT INTO freelancer_message(user_id,freelancer_id,bid_id,file,is_user,date,time) VALUES(?,?,?,?,?,?,?)",
                            [
                              user_id,
                              freelancer_id,
                              bid_id,
                              file_url,
                              is_user,
                              message_date,
                              message_time,
                            ],
                            (error1, result1) => {
                              if (!error1) {
                                db.query(
                                  "SELECT * FROM freelancer_message WHERE bid_id=?",
                                  [bid_id],
                                  (error2, result2) => {
                                    if (!error2) {
                                      res.send({
                                        status: "success",
                                        message: "Add message successfully",
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
                          res.send(error3);
                        }
                      }
                    );
                  } else {
                    res.send(error);
                  }
                }
              );
            }
          } else {
            res.send(error);
          }
        }
      );
    } else {
      db.query(
        "SELECT * FROM freelancer_bid WHERE user_id=? AND freelancer_id=?",
        [user_id, freelancer_id],
        (error, result) => {
          if (!error) {
            if (result.length > 0) {
              let bid_id = result[0].freelancer_bid_id;
              db.query(
                "INSERT INTO freelancer_message(user_id,freelancer_id,bid_id,message,is_user,date,time) VALUES(?,?,?,?,?,?,?)",
                [
                  user_id,
                  freelancer_id,
                  bid_id,
                  message,
                  is_user,
                  message_date,
                  message_time,
                ],
                (error1, result1) => {
                  if (!error1) {
                    db.query(
                      "SELECT * FROM freelancer_message WHERE bid_id=?",
                      [bid_id],
                      (error2, result2) => {
                        if (!error2) {
                          res.send({
                            status: "success",
                            message: "Add message successfully",
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
              db.query(
                "INSERT INTO freelancer_bid(user_id,freelancer_id) VALUES(?,?)",
                [user_id, freelancer_id],
                (error, result) => {
                  if (!error) {
                    db.query(
                      "SELECT * FROM freelancer_bid WHERE user_id=? AND freelancer_id=?",
                      [user_id, freelancer_id],
                      (error3, result3) => {
                        if (!error3) {
                          let bid_id = result3[0].freelancer_bid_id;
                          db.query(
                            "INSERT INTO freelancer_message(user_id,freelancer_id,bid_id,message,is_user,date,time) VALUES(?,?,?,?,?,?,?)",
                            [
                              user_id,
                              freelancer_id,
                              bid_id,
                              message,
                              is_user,
                              message_date,
                              message_time,
                            ],
                            (error1, result1) => {
                              if (!error1) {
                                db.query(
                                  "SELECT * FROM freelancer_message WHERE bid_id=?",
                                  [bid_id],
                                  (error2, result2) => {
                                    if (!error2) {
                                      res.send({
                                        status: "success",
                                        message: "Add message successfully",
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
                          res.send(error3);
                        }
                      }
                    );
                  } else {
                    res.send(error);
                  }
                }
              );
            }
          } else {
            res.send(error);
          }
        }
      );
    }
  }
);

freelancerRouter.post(
  "/v1/add-freelancer-chat",
  upload.single("file"),
  async (req, res) => {
    let user_id = req.query.user_id;
    let freelancer_id = req.query.freelancer_id;
    let message = req.body.message;
    let is_user = req.body.is_user;
    let message_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");
    let message_time = moment().utcOffset("GMT+06:00").format("LT");
    let file_url = null;
    let file_type = req.body.file_type;
    let conversation_id;
    const filesrc = req.file ? req.file.filename : "";
    if (filesrc) {
      file_url = "https://sfinder.app/upload/" + req.file.filename;
    }

    const result = await queryAsync(
      "SELECT * FROM freelancer_conversation WHERE user_id=? AND freelancer_id=?",
      [user_id, freelancer_id]
    );

    if (result.length > 0) {
      conversation_id = result[0].convo_id;
      await queryAsync(
        "INSERT INTO freelancer_message(user_id,freelancer_id,conversation_id,message,is_user,date,time,file,file_type) VALUES(?,?,?,?,?,?,?,?,?)",
        [
          user_id,
          freelancer_id,
          conversation_id,
          message,
          is_user,
          message_date,
          message_time,
          file_url,
          file_type,
        ]
      );
    } else {
      const result1 = await queryAsync(
        "INSERT INTO freelancer_conversation(user_id,freelancer_id) VALUES(?,?)",
        [user_id, freelancer_id]
      );
      conversation_id = result1.insertId;
      await queryAsync(
        "INSERT INTO freelancer_message(user_id,freelancer_id,conversation_id, message,is_user,date,time,file,file_type) VALUES(?,?,?,?,?,?,?,?,?)",
        [
          user_id,
          freelancer_id,
          conversation_id,
          message,
          is_user,
          message_date,
          message_time,
          file_url,
          file_type,
        ]
      );
    }
    res.send({
      status: "success",
      message: "Add message successfully",
      convo_id: conversation_id,
    });
  }
);

freelancerRouter.get("/get-freelancer-chat", upload.none(), (req, res) => {
  let bid_id = req.query.bid_id;

  db.query(
    "SELECT * FROM freelancer_message WHERE bid_id=?",
    [bid_id],
    (error, result) => {
      let user_id = result[0].user_id;
      let freelancer_id = result[0].freelancer_id;

      db.query(
        "SELECT * FROM user WHERE user_id=?",
        [user_id],
        (error1, result1) => {
          if (!error1) {
            db.query(
              "SELECT * FROM freelancer WHERE freelancer_id=?",
              [freelancer_id],
              (error2, result2) => {
                if (!error2) {
                  res.send({
                    status: "success",
                    message: "Get freelancer message successfully",
                    user_info: result1,
                    freelancer_info: result2,
                    data: result,
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
    }
  );
});

freelancerRouter.get("/v1/get-freelancer-chat", upload.none(), (req, res) => {
  let conversation_id = req.query.conversation_id;

  db.query(
    "SELECT * FROM freelancer_message WHERE conversation_id=?",
    [conversation_id],
    (error, result) => {
      console.log("result", result);

      let user_id = result[0].user_id;
      let freelancer_id = result[0].freelancer_id;

      db.query(
        "SELECT * FROM user WHERE user_id=?",
        [user_id],
        (error1, result1) => {
          if (!error1) {
            db.query(
              "SELECT * FROM freelancer WHERE freelancer_id=?",
              [freelancer_id],
              (error2, result2) => {
                if (!error2) {
                  res.send({
                    status: "success",
                    message: "Get freelancer message successfully",
                    user_info: result1,
                    freelancer_info: result2,
                    data: result,
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
    }
  );
});

freelancerRouter.get("/freelancer-user-chat", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM freelancer_message INNER JOIN user ON user.user_id=freelancer_message.user_id WHERE freelancer_message.freelancer_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        const uniqueSData = [];
        const Ids = new Set();

        for (const row of result) {
          if (!Ids.has(row.user_id)) {
            uniqueSData.push(row);
            Ids.add(row.user_id);
          }
        }
        res.send({
          status: "success",
          message: "Get freelancer user chat successfully",
          data: uniqueSData,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/v1/freelancer-user-conversation", (req, res) => {
  let freelancer_id = req.query.freelancer_id;
  db.query(
    "SELECT freelancer_conversation.convo_id, freelancer_conversation.freelancer_id, freelancer_conversation.user_id, user.user_name, user.user_image_url FROM freelancer_conversation INNER JOIN user ON user.user_id=freelancer_conversation.user_id WHERE freelancer_conversation.freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer user chat successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/user-freelancer-chat", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM freelancer_message INNER JOIN freelancer ON freelancer.freelancer_id=freelancer_message.freelancer_id WHERE freelancer_message.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        const uniqueSData = [];
        const Ids = new Set();

        for (const row of result) {
          if (!Ids.has(row.freelancer_id)) {
            uniqueSData.push(row);
            Ids.add(row.freelancer_id);
          }
        }
        res.send({
          status: "success",
          message: "Get user freelancer chat successfully",
          data: uniqueSData,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/v1/user-freelancer-conversation", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT freelancer_conversation.convo_id, freelancer_conversation.freelancer_id, freelancer_conversation.user_id, freelancer.freelancer_name, freelancer.freelancer_profile_pic FROM freelancer_conversation INNER JOIN freelancer ON freelancer.freelancer_id=freelancer_conversation.freelancer_id WHERE freelancer_conversation.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer user chat successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post(
  "/freelancer-enrollment",
  upload.single("file"),
  (req, res) => {
    let freelancer_id = req.query.freelancer_id;
    let payment_method = req.body.payment_method;
    let enrollment_account = req.body.enrollment_account;
    let amount = req.body.amount;
    let pic_url = "";
    const imgsrc = req.file ? req.file.filename : "";

    db.query(
      "SELECT * FROM freelancer_enrollment WHERE freelancer_id=?",
      [freelancer_id],
      (error1, result1) => {
        if (!error1) {
          if (result1.length > 0) {
            res.send({
              status: "failed",
              message: "Already enrolled",
              data: [],
            });
          } else {
            if (imgsrc) {
              pic_url = "https://sfinder.app/upload/" + req.file.filename;
              db.query(
                "INSERT INTO freelancer_enrollment (freelancer_id,payment_method,enrollment_account,amount,file_url) VALUES(?,?,?,?,?)",
                [
                  freelancer_id,
                  payment_method,
                  enrollment_account,
                  amount,
                  pic_url,
                ],
                (error, result) => {
                  if (!error) {
                    res.send({
                      status: "success",
                      message: "Freelancer enrollment successfully",
                      data: [],
                    });
                  } else {
                    res.send(error);
                  }
                }
              );
            } else {
              db.query(
                "INSERT INTO freelancer_enrollment (freelancer_id,payment_method,enrollment_account,amount) VALUES(?,?,?,?)",
                [freelancer_id, payment_method, enrollment_account, amount],
                (error, result) => {
                  if (!error) {
                    res.send({
                      status: "success",
                      message: "Freelancer enrollment successfully",
                      data: [],
                    });
                  } else {
                    res.send(error);
                  }
                }
              );
            }
          }
        } else {
          res.send(error1);
        }
      }
    );
  }
);

freelancerRouter.post("/add-freelancer-bid", upload.none(), (req, res) => {
  let bid_id = req.query.bid_id;
  let note = req.body.note;
  let amount = req.body.amount;

  db.query(
    "UPDATE freelancer_bid SET note=?,bid_amount=? WHERE freelancer_bid_id=?",
    [note, amount, bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Add freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post(
  "/v1/add-freelancer-bid",
  upload.none(),
  async (req, res) => {
    let note = req.body.note;
    let amount = req.body.amount;
    let freelancer_id = req.body.freelancer_id;
    let user_id = req.body.user_id;
    let current_status = "created";

    const isReview = `SELECT * FROM freelancer_bid WHERE is_done=1 AND is_reviewed=0 AND current_status='completed' AND user_id=?`;

    const isReviewResult = await queryAsync(isReview, [user_id]);

    if (isReviewResult.length > 0) {
      return res.send({
        status: "failed",
        message: "You have to review your previous bid first",
        data: [],
      });
    }

    const isRunningBidWithSameFreelancer = `SELECT * FROM freelancer_bid WHERE freelancer_id=? AND user_id=? AND is_done=0 AND is_reviewed=0`;

    const isRunningBidWithSameFreelancerResult = await queryAsync(
      isRunningBidWithSameFreelancer,
      [freelancer_id, user_id]
    );

    console.log(isRunningBidWithSameFreelancerResult);

    if (isRunningBidWithSameFreelancerResult.length > 0) {
      return res.send({
        status: "failed",
        message: "You have running bid with same freelancer",
        data: [],
      });
    }

    db.query(
      "INSERT INTO freelancer_bid (note,bid_amount,freelancer_id,user_id,current_status) VALUES(?,?,?,?,?)",
      [note, amount, freelancer_id, user_id, current_status],
      (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Add freelancer bid successfully",
            bid_id: result.insertId,
          });
        } else {
          res.send(error);
        }
      }
    );
  }
);

freelancerRouter.post("/v1/pay", (req, res) => {
  let bid_id = req.body.bid_id;
  db.query(
    "UPDATE freelancer_bid SET is_paid=?, current_status=? WHERE freelancer_bid_id=?",
    [1, "paid", bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update freelancer bid successfully",
          data: [],
        });
      } else {
        console.log(error);

        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/v1/start-work", (req, res) => {
  let bid_id = req.body.bid_id;
  db.query(
    "UPDATE freelancer_bid SET current_status=? WHERE freelancer_bid_id=?",
    ["start_working", bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/v1/work-done-by-freelancer", (req, res) => {
  let bid_id = req.body.bid_id;
  db.query(
    "UPDATE freelancer_bid SET current_status=? WHERE freelancer_bid_id=?",
    ["work_done", bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/v1/accept-or-cancel-bid", (req, res) => {
  let bid_id = req.body.bid_id;
  let status = req.body.status;
  let is_delete = 0;
  let id_done = 0;
  console.log(status);

  if (status == "cancel") {
    is_delete = 1;
    id_done = 1;
  }
  db.query(
    "UPDATE freelancer_bid SET is_delete=?, is_done=?, current_status=? WHERE freelancer_bid_id=?",
    [is_delete, id_done, status, bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/v1/customer-cancel-before-paid", async (req, res) => {
  let bid_id = req.body.bid_id;
  const bid = await queryAsync(
    "SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?",
    [bid_id]
  );

  if (bid.length > 0) {
    if (bid[0].is_paid != 0) {
      return res.send({
        status: "failed",
        message: "Already paid",
        data: [],
      });
    }
  }
  db.query(
    "UPDATE freelancer_bid SET is_delete=?, is_done=?, current_status=? WHERE freelancer_bid_id=?",
    [1, 1, "customer_cancel_before_paid", bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/v1/cancel-after-paid", async (req, res) => {
  let bid_id = req.body.bid_id;
  let reason = req.body.reason;

  const result = await queryAsync(
    "SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?",
    [bid_id]
  );

  if (!result.length) {
    return res.send({
      status: "failed",
      message: "Bid not found",
      data: [],
    });
  }

  if (result[0].is_paid != 1) {
    return res.send({
      status: "failed",
      message: "Bid not paid",
      data: [],
    });
  }

  await queryAsync(
    "UPDATE freelancer_bid SET is_cancel_request=?, current_status=? WHERE freelancer_bid_id=?",
    [1, "customer_cancel_after_paid", bid_id]
  );

  db.query(
    "INSERT INTO cancel_bid (bid_id, reason, amount, is_paid) VALUES(?,?,?,?)",
    [bid_id, reason, result[0].bid_amount, result[0].is_paid],
    (error, result) => {
      if (!error) {
        return res.send({
          status: "success",
          message: "Cancel bid successfully",
          data: [],
        });
      }
    }
  );
});

freelancerRouter.post("/edit-freelancer-bid", upload.none(), (req, res) => {
  let bid_id = req.query.bid_id;

  // Create an object to hold the fields to update
  let updateFields = {};
  if (req.body.note) updateFields.note = req.body.note;
  if (req.body.amount) updateFields.bid_amount = req.body.amount;
  if (req.body.freelancer_id)
    updateFields.freelancer_id = req.body.freelancer_id;
  if (req.body.user_id) updateFields.user_id = req.body.user_id;
  if (req.body.is_done) updateFields.is_done = req.body.is_done;
  if (req.body.is_paid) updateFields.is_paid = req.body.is_paid;
  if (req.body.is_delete) updateFields.is_delete = req.body.is_delete;
  // updateFields.bid_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");

  // Generate the dynamic SQL query and values
  let fields = Object.keys(updateFields)
    .map((field) => `${field}=?`)
    .join(", ");
  let values = Object.values(updateFields);
  values.push(bid_id); // Add bid_id at the end for the WHERE condition

  // Perform the update
  db.query(
    `UPDATE freelancer_bid SET ${fields} WHERE freelancer_bid_id=?`,
    values,
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Edit freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/delete-freelancer-bid", upload.none(), (req, res) => {
  let bid_id = req.query.bid_id;
  db.query(
    "UPDATE freelancer_bid SET is_delete=1 WHERE freelancer_bid_id=?",
    [bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Delete freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/confirm-freelancer-bid", upload.none(), (req, res) => {
  let bid_id = req.query.bid_id;
  db.query(
    "UPDATE freelancer_bid SET is_done=? WHERE freelancer_bid_id=?",
    [1, bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Confirm freelancer bid successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

// freelancerRouter.post("/complete-freelancer-bid", upload.none(), (req, res) => {
//   let freelancer_bid = req.query.freelancer_bid;
//   let bid_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");
//   db.query(
//     "UPDATE freelancer_bid SET is_paid=?,bid_date=? WHERE freelancer_bid_id=?",
//     [1, bid_date, freelancer_bid],
//     (error, result) => {
//       if (!error) {
//         db.query(
//           "SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?",
//           [freelancer_bid],
//           (error1, result1) => {
//             if (!error1) {
//               let amount = result1[0].bid_amount;
//               let freelancer_id = result1[0].freelancer_id;
//               let final_amount = amount * 0.8;
//               db.query(
//                 "SELECT * FROM freelancer WHERE freelancer_id=?",
//                 [freelancer_id],
//                 (error2, result2) => {
//                   if (!error2) {
//                     let final_balance;
//                     let balance = result2[0].freelancer_balance;
//                     final_balance = balance + final_amount;
//                     db.query(
//                       "UPDATE freelancer SET freelancer_balance=? WHERE freelancer_id=?",
//                       [final_balance, freelancer_id],
//                       (error3, result3) => {
//                         if (!error3) {
//                           res.send({
//                             status: "success",
//                             message: "Complete freelancer bid successfully",
//                             data: [],
//                           });
//                         } else {
//                           res.send(error3);
//                         }
//                       }
//                     );
//                   } else {
//                     res.send(error2);
//                   }
//                 }
//               );
//             } else {
//               res.send(error);
//             }
//           }
//         );
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

freelancerRouter.post(
  "/complete-freelancer-bid",
  upload.none(),
  async (req, res) => {
    try {
      let freelancer_bid = req.query.freelancer_bid;
      let bid_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");

      const updateFreelancerBidQuery = `
      UPDATE freelancer_bid SET is_paid=?, bid_date=? WHERE freelancer_bid_id=?
    `;
      await queryAsync(updateFreelancerBidQuery, [1, bid_date, freelancer_bid]);

      const getFreelancerBidQuery = `
      SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?
    `;
      const freelancerBid = await queryAsync(getFreelancerBidQuery, [
        freelancer_bid,
      ]);

      let amount = freelancerBid[0].bid_amount;
      let freelancer_id = freelancerBid[0].freelancer_id;
      let user_id = freelancerBid[0].user_id;
      let final_amount = amount * 0.8;

      const getFreelancerQuery = `
      SELECT * FROM freelancer WHERE freelancer_id=?
    `;
      const freelancer = await queryAsync(getFreelancerQuery, [freelancer_id]);

      let final_balance;
      let balance = freelancer[0].freelancer_balance;
      final_balance = balance + final_amount;

      const updateFreelancerBalanceQuery = `
      UPDATE freelancer SET freelancer_balance=? WHERE freelancer_id=?
    `;
      await queryAsync(updateFreelancerBalanceQuery, [
        final_balance,
        freelancer_id,
      ]);

      const insertFreelancerWithdrawHistoryQuery = `
      INSERT INTO freelancer_bid_history (bid_id, freelancer_id, user_id, bid_amount)
      VALUES (?, ?, ?, ?)
    `;
      await queryAsync(insertFreelancerWithdrawHistoryQuery, [
        freelancer_bid,
        freelancer_id,
        user_id,
        amount,
      ]);

      const getFreelancerWithdrawHistoryQuery = `
      SELECT * FROM freelancer_bid_history WHERE bid_id=?
    `;
      const freelancerWithdrawHistory = await queryAsync(
        getFreelancerWithdrawHistoryQuery,
        [freelancer_bid]
      );

      res.send({
        status: "success",
        message: "Complete freelancer bid successfully",
        data: {
          freelancer_bid: freelancerBid,
          freelancer_withdraw_history: freelancerWithdrawHistory,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
);

freelancerRouter.post(
  "/v1/complete-freelancer-bid",
  upload.none(),
  async (req, res) => {
    try {
      let freelancer_bid = req.query.freelancer_bid;
      let bid_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");

      const updateFreelancerBidQuery = `
      UPDATE freelancer_bid SET is_done=?, is_paid=?, current_status=? WHERE freelancer_bid_id=?
    `;
      await queryAsync(updateFreelancerBidQuery, [
        1,
        1,
        "completed",
        freelancer_bid,
      ]);

      const getFreelancerBidQuery = `
      SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?
    `;
      const freelancerBid = await queryAsync(getFreelancerBidQuery, [
        freelancer_bid,
      ]);

      let amount = freelancerBid[0].bid_amount;
      let freelancer_id = freelancerBid[0].freelancer_id;
      let user_id = freelancerBid[0].user_id;

      const getFreelancerQuery = `
      SELECT * FROM freelancer WHERE freelancer_id=?
    `;
      const freelancer = await queryAsync(getFreelancerQuery, [freelancer_id]);

      let final_balance;
      let balance = freelancer[0].freelancer_balance;
      final_balance = balance + amount;

      const updateFreelancerBalanceQuery = `
      UPDATE freelancer SET freelancer_balance=? WHERE freelancer_id=?
    `;
      await queryAsync(updateFreelancerBalanceQuery, [
        final_balance,
        freelancer_id,
      ]);

      const insertFreelancerWithdrawHistoryQuery = `
      INSERT INTO freelancer_bid_history (bid_id, freelancer_id, user_id, bid_amount)
      VALUES (?, ?, ?, ?)
    `;
      await queryAsync(insertFreelancerWithdrawHistoryQuery, [
        freelancer_bid,
        freelancer_id,
        user_id,
        amount,
      ]);

      const getFreelancerWithdrawHistoryQuery = `
      SELECT * FROM freelancer_bid_history WHERE bid_id=?
    `;
      const freelancerWithdrawHistory = await queryAsync(
        getFreelancerWithdrawHistoryQuery,
        [freelancer_bid]
      );

      res.send({
        status: "success",
        message: "Complete freelancer bid successfully",
        data: {
          freelancer_bid: freelancerBid,
          freelancer_withdraw_history: freelancerWithdrawHistory,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
);

freelancerRouter.post(
  "/v1/review-freelancer-bid",
  upload.none(),
  async (req, res) => {
    try {
      let freelancer_bid_id = req.body.freelancer_bid_id;
      let review_star = req.body.review_star;
      let comment = req.body.comment;

      if (!comment) {
        comment = null;
      }

      const freelancerBidQuery = `
      SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?
    `;
      const freelancerBid = await queryAsync(freelancerBidQuery, [
        freelancer_bid_id,
      ]);

      if (freelancerBid.length == 0) {
        res.send({
          status: "error",
          message: "Freelancer bid not found",
          data: [],
        });
        return;
      }

      if (freelancerBid[0].is_reviewed == 1) {
        res.send({
          status: "error",
          message: "Freelancer bid has been reviewed",
          data: [],
        });
        return;
      }

      const reviewFreelancerBidQuery = `
   INSERT INTO review (bid_id, review_star, comment) VALUES (?, ?, ?)
    `;
      await queryAsync(reviewFreelancerBidQuery, [
        freelancer_bid_id,
        review_star,
        comment,
      ]);

      const updateFreelancerBidQuery = `
      UPDATE freelancer_bid SET is_reviewed=? WHERE freelancer_bid_id=?
    `;
      await queryAsync(updateFreelancerBidQuery, [1, freelancer_bid_id]);

      const getFreelancerBidQuery = `
      SELECT * FROM review WHERE bid_id=?
    `;
      const freelancerReview = await queryAsync(getFreelancerBidQuery, [
        freelancer_bid_id,
      ]);

      res.send({
        status: "success",
        message: "Complete freelancer bid successfully",
        data: {
          freelancerReview: freelancerReview,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
);

freelancerRouter.get("/get-freelancer-bid", (req, res) => {
  let bid_id = req.query.bid_id;

  db.query(
    "SELECT * FROM freelancer_bid WHERE freelancer_bid_id=?",
    [bid_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer bid successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/user-freelancer-profile", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM freelancer WHERE user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer profile successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/get-freelancer-bid-history", (req, res) => {
  let freelancer_id = req.query.freelancer_id;

  db.query(
    "SELECT * FROM freelancer_bid INNER JOIN user ON user.user_id=freelancer_bid.user_id WHERE freelancer_bid.freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer bid history successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/get-freelancer-link", (req, res) => {
  let freelancer_id = req.query.freelancer_id;

  db.query(
    "SELECT * FROM freelancer_link WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer link successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/add-freelancer-link", upload.none(), (req, res) => {
  let freelancer_id = req.query.freelancer_id;
  let title = req.body.title;
  let link = req.body.link;

  db.query(
    "INSERT INTO freelancer_link(freelancer_id,title,link) VALUES(?,?,?)",
    [freelancer_id, title, link],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Add freelancer link successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/edit-freelancer-link", upload.none(), (req, res) => {
  let freelancer_link_id = req.query.freelancer_link_id;
  let title = req.body.title;
  let link = req.body.link;

  db.query(
    "UPDATE freelancer_link SET title=?,link=? WHERE freelancer_link_id=?",
    [title, link, freelancer_link_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Edit freelancer link successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/delete-freelancer-link", (req, res) => {
  let freelancer_link_id = req.query.freelancer_link_id;

  db.query(
    "DELETE FROM freelancer_link WHERE freelancer_link_id=?",
    [freelancer_link_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Delete freelancer link successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post(
  "/freelancer-balance-withdraw",
  upload.none(),
  (req, res) => {
    let freelancer_id = req.query.freelancer_id;
    let name = req.body.name;
    let address = req.body.address;
    let bank_name = req.body.bank_name;
    let bank_acc_holder_name = req.body.bank_acc_holder_name;
    let division = req.body.division;
    let district = req.body.district;
    let branch_name = req.body.branch_name;
    let routing_number = req.body.routing_number;
    let amount = req.body.amount;
    let status = "Pending";

    db.query(
      "INSERT INTO freelancer_balance_withdraw(freelancer_id,name,address,bank_name,bank_acc_holder_name,division,district,branch_name,routing_number,amount,status, date) VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW())",
      [
        freelancer_id,
        name,
        address,
        bank_name,
        bank_acc_holder_name,
        division,
        district,
        branch_name,
        routing_number,
        amount,
        status,
      ],
      (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Add freelancer balance withdraw successfully",
            data: [],
          });
        } else {
          res.send(error);
        }
      }
    );
  }
);

freelancerRouter.get("/freelancer-withdraw-history", (req, res) => {
  let freelancer_id = req.query.freelancer_id;

  db.query(
    "SELECT * FROM freelancer_balance_withdraw WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer balance withdraw history successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.post("/add-freelancer-review", upload.none(), (req, res) => {
  let freelancer_id = req.query.freelancer_id;
  let user_id = req.query.user_id;
  let review_star = req.body.review_star;
  let review_title = req.body.review_title;
  let average_star = 0;
  let freelancer_star;

  db.query(
    "INSERT INTO freelancer_review (freelancer_id,user_id,review_star,review_title) VALUES(?,?,?,?)",
    [freelancer_id, user_id, review_star, review_title],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM freelancer_review WHERE freelancer_id=?",
          [freelancer_id],
          (error1, result1) => {
            if (!error1) {
              for (let i = 0; i < result1.length; i++) {
                average_star += result1[i].review_star;
              }
              freelancer_star = average_star / result1.length;
              db.query(
                "UPDATE freelancer SET freelancer_review_star=? WHERE freelancer_id=?",
                [freelancer_star, freelancer_id],
                (error2, result2) => {
                  if (!error2) {
                    res.send({
                      status: "success",
                      message: "Add freelancer review successfully",
                      data: [],
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
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/get-freelancer-review", (req, res) => {
  let freelancer_id = req.query.freelancer_id;

  db.query(
    "SELECT * FROM freelancer_review INNER JOIN user ON user.user_id=freelancer_review.user_id WHERE freelancer_review.freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get freelancer review successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get("/get-status", (req, res) => {
  let bid_id = req.query.bid_id; // ✅ use query param here

  db.query(
    "SELECT freelancer_bid.current_status FROM freelancer_bid WHERE freelancer_bid_id = ?",
    [bid_id],
    (error, result) => {
      if (!error) {
        console.log(result);
        res.send({
          status: "success",
          message: "Get freelancer status successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

freelancerRouter.get(
  "/get-freelancer-bid-list",
  upload.none(),
  async (req, res) => {
    try {
      const { user_id, freelancer_id } = req.query;

      if (!user_id || !freelancer_id) {
        return res.send({
          status: "error",
          message: "user_id and freelancer_id are required",
          data: [],
        });
      }

      const query = `
        SELECT * FROM freelancer_bid 
        WHERE user_id = ? AND freelancer_id = ?
      `;

      const bidList = await queryAsync(query, [user_id, freelancer_id]);

      res.send({
        status: "success",
        message: "Freelancer bid list retrieved successfully",
        data: bidList,
      });
    } catch (error) {
      console.error("Error fetching freelancer bids:", error);
      res.send({
        status: "error",
        message: "Server error",
        data: [],
      });
    }
  }
);

freelancerRouter.get("/get-not-reviewed-freelancers", async (req, res) => {
  try {
    const freelancers = await queryAsync(
      "SELECT * FROM freelancer_bid INNER JOIN freelancer ON freelancer.freelancer_id=freelancer_bid.freelancer_id WHERE is_reviewed = 0 AND freelancer_bid.user_id=?",
      [req.query.user_id]
    );
    res.send({
      status: "success",
      message: "Get freelancers successfully",
      freelancer_bid_id: freelancers[0].freelancer_bid_id,
      freelancer_id: freelancers[0].freelancer_id,
      freelancer_name: freelancers[0].freelancer_name,
    });
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.send({
      status: "error",
      message: "Server error",
      data: [],
    });
  }
});

freelancerRouter.get("/get-total-completed-bid", async (req, res) => {
  try {
    const freelancers = await queryAsync(
      "SELECT COUNT(*) as total_completed_bid FROM freelancer_bid WHERE freelancer_bid.current_status = 'completed' AND freelancer_bid.freelancer_id=?",
      [req.query.freelancer_id]
    );
    res.send({
      status: "success",
      message: "Get total completed bid successfully",
      total_completed_bid: freelancers[0].total_completed_bid,
    });
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.send({
      status: "error",
      message: "Server error",
      data: [],
    });
  }
});

module.exports = freelancerRouter;
