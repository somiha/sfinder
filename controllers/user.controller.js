const db = require("../config/database");

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
    const perPage = 15;
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

// exports.getUserReset = (req, res) => {

//   db.query(
//     "SELECT * FROM user_reset INNER JOIN user ON user.user_id=user_reset.user_id ORDER BY user_reset.status",
//     (error, result) => {
//       if (!error) {
//         res.render("user-reset", { user_reset: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getUserReset = async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM user_reset 
      INNER JOIN user ON user.user_id = user_reset.user_id 
      WHERE user_reset.status = 0
    `;
    result = await queryAsyncWithoutValue(query);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;

    const paginated = result.slice(startIdx, startIdx + perPage);

    return res.status(200).render("user-reset", {
      title: "User Reset",
      user_reset: result,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.filtering = (req, res) => {
  let filtering_option = req.body.filtering_option;
  if (filtering_option) {
    return res.redirect("/admin/user-reset?status=" + filtering_option);
  }

  return res.redirect("/admin/user-reset");
};

exports.changeUserResetOption = (req, res) => {
  let user_reset_id = req.params.id;
  let user_reset_status = req.body.user_reset_status;

  console.log(req.body);

  console.log("reset", user_reset_id, user_reset_status);

  db.query(
    "UPDATE user_reset SET status=? WHERE user_reset_id=?",
    [user_reset_status, user_reset_id],
    (error, result) => {
      console.log(result);
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
    const perPage = 15;
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

exports.deleteSelectedUsers = async (req, res) => {
  try {
    const selectedUsers = req.body.selectedUsers;

    if (!selectedUsers || !Array.isArray(selectedUsers)) {
      return res.status(400).json({ msg: "No users selected" });
    }

    // Convert user IDs to integers for safety
    const userIds = selectedUsers
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (userIds.length === 0) {
      return res.status(400).json({ msg: "No valid user IDs provided" });
    }

    // Delete users in a single query
    const deleteQuery = `DELETE FROM user WHERE user_id IN (?)`;
    await queryAsync(deleteQuery, [userIds]);

    req.flash("success", `${userIds.length} user(s) deleted successfully`);
    return res.redirect("/admin/user");
  } catch (error) {
    console.log(error);

    return res.redirect("/admin/user");
  }
};

exports.searchUserReport = async (req, res) => {
  try {
    const search_user = req.body.search_user;
    const userQuery = `SELECT * FROM user_report INNER JOIN user ON user.user_id=user_report.user_id WHERE user_email=?`;

    const user_report = await queryAsync(userQuery, [search_user]);

    // const page = parseInt(req.query.page) || 1;
    // const perPage = 15;
    // const startIdx = (page - 1) * perPage;
    // const paginated = user.slice(startIdx, startIdx + perPage);

    return res.status(200).render("user-report", {
      title: "User Report List",
      user_report,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchUserReset = async (req, res) => {
  try {
    const search_user = req.body.search_user;
    const userQuery = `SELECT * FROM user_reset INNER JOIN user ON user.user_id=user_reset.user_id WHERE user_email=? AND user_reset.status=0`;

    const user_reset = await queryAsync(userQuery, [search_user]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = user.slice(startIdx, startIdx + perPage);

    return res.status(200).render("user-reset", {
      title: "User Reset List",
      user_reset,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.resetUsers = async (req, res) => {
  try {
    let { actionType, selectedResets } = req.body;

    // Convert single selection to array
    if (selectedResets && !Array.isArray(selectedResets)) {
      selectedResets = [selectedResets];
    }

    if (!actionType || !selectedResets) {
      return res.redirect("/admin/user-reset");
    }

    if (selectedResets.length === 0) {
      return res.redirect("/admin/user-reset");
    }

    if (actionType === "approve") {
      const placeholders = selectedResets.map(() => "?").join(",");
      const query = `UPDATE user_reset SET status = 1 WHERE user_reset_id IN (${placeholders})`;
      await queryAsync(query, selectedResets);
      const getDeviceIdQuery = `SELECT device_id, user_id FROM user_reset WHERE user_reset_id IN (${placeholders})`;
      const deviceIds = await queryAsync(getDeviceIdQuery, selectedResets);
      const updateDeviceIdQuery = `UPDATE user SET device_id = ? WHERE user_id = ?`;
      const values = deviceIds
        .map((deviceId) => [deviceId.device_id, deviceId.user_id])
        .flat();
      await queryAsync(updateDeviceIdQuery, values);
    } else if (actionType === "delete") {
      const placeholders = selectedResets.map(() => "?").join(",");
      const query = `DELETE FROM user_reset WHERE user_reset_id IN (${placeholders})`;
      await queryAsync(query, selectedResets);
    }

    return res.redirect("/admin/user-reset");
  } catch (error) {
    console.error("Error in ResetUsers:", error);
    return res.redirect("/admin/user-reset");
  }
};
