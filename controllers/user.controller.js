const db = require("../config/database");

// exports.getUser = (req, res) => {
//   db.query("SELECT * FROM user", (error, result) => {
//     if (!error) {
//       res.render("user", { user: result });
//     } else {
//       res.send(error);
//     }
//   });
// };

function queryAsync(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else resolve(result);
    });
  });
}
function queryAsyncWithoutValue(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

exports.getUser = async (req, res) => {
  try {
    const userQuery = `SELECT * FROM user`;

    const user = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;
    const paginated = user.slice(startIdx, startIdx + perPage);

    return res.status(200).render("user", {
      title: "User List",
      user,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getUserDetails = (req, res) => {
  let user_id = req.params.id;
  db.query(
    "SELECT user.*, user_balance.* FROM user LEFT JOIN user_balance ON user.user_id=user_balance.user_id WHERE user.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        res.render("user-details", { userInfo: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.changeUserVerification = (req, res) => {
  let user_id = req.params.id;
  let user_verification_status = req.body.user_verification_status;

  const verification_date = user_verification_status == 1 ? new Date() : null;
  db.query(
    "UPDATE user SET user_verification=? , last_verification_date=? WHERE user_id=?",
    [user_verification_status, verification_date, user_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user");
      } else {
        res.send(error);
      }
    }
  );
};

// exports.getUserReport = (req, res) => {
//   db.query(
//     "SELECT * FROM user_report INNER JOIN user ON user.user_id=user_report.user_id",
//     (error, result) => {
//       if (!error) {
//         res.render("user-report", { user_report: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getUserReport = (req, res) => {
  const userId = req.query.user_id;
  console.log(userId);

  const query = userId
    ? "SELECT * FROM user_report INNER JOIN user ON user.user_id=user_report.user_id WHERE user_report.user_id = ?"
    : "SELECT * FROM user_report INNER JOIN user ON user.user_id=user_report.user_id";

  db.query(query, userId ? [userId] : [], (error, result) => {
    if (!error) {
      res.render("user-report", { user_report: result });
    } else {
      res.send(error);
    }
  });
};

exports.getUserReportDetails = (req, res) => {
  let user_report_id = req.params.id;

  db.query(
    "SELECT * FROM user_report WHERE user_report_id=?",
    [user_report_id],
    (error, result) => {
      if (!error) {
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
                    db.query(
                      "SELECT * FROM user_report_photo WHERE user_report_id=?",
                      [user_report_id],
                      (error3, result3) => {
                        if (!error3) {
                          res.render("user-report-details", {
                            user_report_details: result,
                            user_info: result1,
                            freelancer_info: result2,
                            user_report_photo: result3,
                          });
                        } else {
                          res.send(error3);
                        }
                      }
                    );
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
};

exports.deleteUserReport = (req, res) => {
  let user_report_id = req.params.id;

  db.query(
    "DELETE FROM user_report WHERE user_report_id=?",
    [user_report_id],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM user_report_photo WHERE user_report_id=?",
          [user_report_id],
          (error1, result1) => {
            if (!error1) {
              res.redirect("/admin/user-report");
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
};

exports.getUserReset = (req, res) => {
  db.query(
    "SELECT * FROM user_reset INNER JOIN user ON user.user_id=user_reset.user_id ORDER BY user_reset.status",
    (error, result) => {
      if (!error) {
        res.render("user-reset", { user_reset: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.changeUserResetOption = (req, res) => {
  let user_reset_id = req.params.id;
  let user_reset_status = req.body.user_reset_status;

  db.query(
    "UPDATE user_reset SET status=? WHERE user_reset_id=?",
    [user_reset_status, user_reset_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM user_reset WHERE user_reset_id=?",
          [user_reset_id],
          (error1, result1) => {
            if (!error1) {
              let user_id = result1[0].user_id;
              let device_id = result1[0].device_id;
              db.query(
                "UPDATE user SET device_id=? WHERE user_id=?",
                [device_id, user_id],
                (error2, result2) => {
                  if (!error2) {
                    res.redirect("/admin/user-reset");
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
};

exports.deleteUserReset = (req, res) => {
  let user_reset_id = req.params.id;

  db.query(
    "DELETE FROM user_reset WHERE user_reset_id=?",
    [user_reset_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-reset");
      } else {
        res.send(error);
      }
    }
  );
};

// exports.searchUser = (req, res) => {
//   let search_user = req.body.search_user;
//   db.query(
//     "SELECT * FROM user WHERE user_email=?",
//     [search_user],
//     (error, result) => {
//       if (!error) {
//         res.render("user", { user: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.searchUser = async (req, res) => {
  try {
    const search_user = req.body.search_user;
    const userQuery = `SELECT * FROM user WHERE user_email=?`;

    const user = await queryAsync(userQuery, [search_user]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;
    const paginated = user.slice(startIdx, startIdx + perPage);

    return res.status(200).render("user", {
      title: "User List",
      user,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteUser = (req, res) => {
  let user_id = req.params.id;

  db.query("DELETE FROM user WHERE user_id=?", [user_id], (error, result) => {
    if (!error) {
      res.redirect("/admin/user");
    } else {
      res.send(error);
    }
  });
};

exports.getOneYearOveredVerifiedUser = async (req, res) => {
  try {
    const query = `SELECT * FROM user WHERE last_verification_date < NOW() - INTERVAL 1 YEAR AND user_verification = 1`;

    const result = await queryAsync(query);

    return res.render("one-year-overed-verified-user", {
      oneYearOveredVerifiedUser: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteOneYearOveredVerifiedUser = async (req, res) => {
  try {
    const query = `UPDATE user SET user_verification = 0, last_verification_date = NULL WHERE last_verification_date < NOW() - INTERVAL 1 YEAR AND user_verification = 1`;

    await queryAsync(query);

    return res.redirect("/admin/one-year-overed-verified-user");
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.unverifyUser = (req, res) => {
  let user_id = req.query.id;

  db.query(
    "UPDATE user SET user_verification=? , last_verification_date=? WHERE user_id=?",
    [0, null, user_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/one-year-overed-verified-user");
      } else {
        res.send(error);
      }
    }
  );
};
