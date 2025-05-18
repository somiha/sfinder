const db = require("../config/database");

// exports.getFreelancer = (req, res) => {
//   db.query(
//     "SELECT freelancer.*, user.user_email, user.user_mobile_number FROM freelancer INNER JOIN user ON freelancer.user_id = user.user_id;",
//     (error, result) => {
//       if (!error) {
//         res.render("freelancer", { freelancer: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

function queryAsyncWithoutValue(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

exports.getFreelancer = async (req, res) => {
  try {
    const freelancerQuery = `
    SELECT freelancer.*, 
       user.user_email, 
       user.user_mobile_number, 
       user_report.user_report_id 
FROM freelancer 
INNER JOIN user ON freelancer.user_id = user.user_id
LEFT JOIN user_report ON freelancer.user_id = user_report.user_id;
    `;

    const freelancers = await queryAsyncWithoutValue(freelancerQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancers.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer", {
      title: "Freelancers",
      freelancer: freelancers,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getRejectedFreelancer = async (req, res) => {
  try {
    const freelancerQuery = `
    SELECT freelancer.*, 
       user.user_email, 
       user.user_mobile_number
FROM freelancer 
INNER JOIN user ON freelancer.user_id = user.user_id
WHERE freelancer_acc_status = 4;
    `;

    const freelancers = await queryAsyncWithoutValue(freelancerQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancers.slice(startIdx, startIdx + perPage);

    return res.status(200).render("rejected-freelancer", {
      title: "Freelancers",
      freelancer: freelancers,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchRejectedFreelancer = async (req, res) => {
  try {
    const searchFreelancerQuery = `
       SELECT freelancer.*, 
       user.user_email, 
       user.user_mobile_number
FROM freelancer 
INNER JOIN user ON freelancer.user_id = user.user_id
WHERE freelancer_acc_status = 4;
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const freelancer = await queryAsyncWithoutValue(searchFreelancerQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancer.slice(startIdx, startIdx + perPage);

    return res.status(200).render("rejected-freelancer", {
      title: "Rejected Freelancer",
      freelancer: freelancer,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.changeFreelancerEnrollmentStatus = (req, res) => {
//   let freelancer_id = req.params.id;
//   let status = req.body.status;

//   db.query(
//     "UPDATE freelancer_enrollment SET status=? WHERE freelancer_id=?",
//     [status, freelancer_id],
//     (error1, result1) => {
//       if (!error1) {
//         db.query(
//           "UPDATE freelancer SET freelancer_acc_status=? WHERE freelancer_id=?",
//           [status, freelancer_id],
//           (error, result) => {
//             if (!error) {
//               res.redirect("/admin/freelancer-enrollment");
//             } else {
//               res.send(error);
//             }
//           }
//         );
//       } else {
//         res.send(error1);
//       }
//     }
//   );
// };

exports.changeFreelancerEnrollmentStatus = (req, res) => {
  let freelancer_id = req.params.id;
  let status = req.body.status;

  // Get the current datetime
  const currentDateTime = new Date();

  db.query(
    "UPDATE freelancer_enrollment SET status=? WHERE freelancer_id=?",
    [status, freelancer_id],
    (error1, result1) => {
      if (!error1) {
        if (status === "1") {
          db.query(
            `UPDATE freelancer 
             SET freelancer_acc_status=?, 
                 verification_date=? 
             WHERE freelancer_id=?`,
            [status, currentDateTime, freelancer_id],
            (error2, result2) => {
              if (!error2) {
                res.redirect("/admin/freelancer-enrollment");
              } else {
                res.send(error2);
              }
            }
          );
        } else {
          db.query(
            "UPDATE freelancer SET freelancer_acc_status=? WHERE freelancer_id=?",
            [status, freelancer_id],
            (error, result) => {
              if (!error) {
                res.redirect("/admin/freelancer-enrollment");
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
};

exports.getFreelancerInfo = (req, res) => {
  let freelancer_id = req.params.id;

  db.query(
    "SELECT freelancer.*, user.user_email, user.user_mobile_number FROM freelancer INNER JOIN user ON freelancer.user_id = user.user_id WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.render("freelancer-info", { freelancer_info: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.getFreelancerEnrollment = async (req, res) => {
  try {
    const status = req.query.status;

    let freelancerEnrollment = [];
    if (status) {
      const getFreelancerEnrollmentQuery = `
      SELECT 
        freelancer_enrollment.*,
        freelancer.freelancer_id,
        freelancer.freelancer_name
      FROM freelancer_enrollment
      INNER JOIN freelancer ON freelancer_enrollment.freelancer_id = freelancer.freelancer_id
      WHERE freelancer_enrollment.status = ${status}
    `;
      freelancerEnrollment = await queryAsync(getFreelancerEnrollmentQuery, [
        status,
      ]);
    } else {
      const getFreelancerEnrollmentQuery = `
      SELECT 
        freelancer_enrollment.*,
        freelancer.freelancer_id,
        freelancer.freelancer_name
      FROM freelancer_enrollment
      INNER JOIN freelancer ON freelancer_enrollment.freelancer_id = freelancer.freelancer_id
      WHERE freelancer.freelancer_acc_status != -1
    `;
      freelancerEnrollment = await queryAsyncWithoutValue(
        getFreelancerEnrollmentQuery
      );
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerEnrollment.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-enrollment", {
      title: "Freelancer Enrollment",
      freelancer_enrollment: freelancerEnrollment,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.filtering = (req, res) => {
  let filtering_option = req.body.filtering_option;
  console.log(filtering_option);

  if (filtering_option) {
    return res.redirect(
      "/admin/freelancer-enrollment?status=" + filtering_option
    );
  }

  return res.redirect("/admin/freelancer-enrollment");
};

// exports.getFreelancerWithdraw = (req, res) => {
//   db.query(
//     "SELECT * FROM freelancer_balance_withdraw INNER JOIN freelancer ON freelancer_balance_withdraw.freelancer_id=freelancer.freelancer_id ",
//     (error, result) => {
//       if (!error) {
//         res.render("freelancer-withdraw", { freelancer_withdraw: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getFreelancerWithdraw = async (req, res) => {
  try {
    const getFreelancerWithdrawQuery = `
      SELECT 
        freelancer_balance_withdraw.*,
        freelancer.freelancer_id,
        freelancer.freelancer_name
      FROM freelancer_balance_withdraw
      INNER JOIN freelancer ON freelancer_balance_withdraw.freelancer_id = freelancer.freelancer_id
    `;

    let freelancerWithdraw = await queryAsyncWithoutValue(
      getFreelancerWithdrawQuery
    );

    const status = req.query.status;
    if (status) {
      freelancerWithdraw = freelancerWithdraw.filter(
        (withdraw) => withdraw.status === status
      );
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerWithdraw.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-withdraw", {
      title: "Freelancer Withdraw",
      freelancer_withdraw: freelancerWithdraw,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.changeFreelancerWithdrawStatus = (req, res) => {
  let freelancer_withdraw_id = req.params.id;
  let status = req.body.status;

  db.query(
    "UPDATE freelancer_balance_withdraw SET status=? WHERE freelancer_balance_withdraw_id=?",
    [status, freelancer_withdraw_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/freelancer-withdraw");
      } else {
        res.send(error);
      }
    }
  );
};

// exports.searchFreelancer = (req, res) => {
//   let search_freelancer = req.body.search_freelancer;
//   let freelancer_id = search_freelancer.replace("A-", "");

//   db.query(
//     "SELECT * FROM freelancer WHERE freelancer_id=?",
//     [freelancer_id],
//     (error, result) => {
//       if (!error) {
//         res.render("freelancer", { freelancer: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.searchFreelancer = async (req, res) => {
  try {
    const searchFreelancerQuery = `
      SELECT freelancer.*, 
       user.user_email, 
       user.user_mobile_number, 
       user_report.user_report_id 
FROM freelancer 
INNER JOIN user ON freelancer.user_id = user.user_id
LEFT JOIN user_report ON freelancer.user_id = user_report.user_id
      WHERE freelancer.freelancer_id = ?
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const freelancer = await queryAsync(searchFreelancerQuery, [freelancerId]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancer.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer", {
      title: "Freelancer",
      freelancer: freelancer,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchFreelancerEnrollment = async (req, res) => {
  try {
    const searchFreelancerEnrollmentQuery = `
      SELECT 
        freelancer_enrollment.*,
        freelancer.freelancer_id,
        freelancer.freelancer_name
      FROM freelancer_enrollment
      INNER JOIN freelancer ON freelancer_enrollment.freelancer_id = freelancer.freelancer_id
      WHERE freelancer.freelancer_acc_status != -1 AND freelancer_enrollment.freelancer_id = ?
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const freelancerEnrollment = await queryAsync(
      searchFreelancerEnrollmentQuery,
      [freelancerId]
    );

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerEnrollment.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-enrollment", {
      title: "Freelancer Enrollment",
      freelancer_enrollment: freelancerEnrollment,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchFreelancerWithdraw = async (req, res) => {
  try {
    const searchFreelancerWithdrawQuery = `
      SELECT 
        freelancer_balance_withdraw.*,
        freelancer.freelancer_id,
        freelancer.freelancer_name
      FROM freelancer_balance_withdraw
      INNER JOIN freelancer ON freelancer_balance_withdraw.freelancer_id = freelancer.freelancer_id
      WHERE freelancer_balance_withdraw.freelancer_id = ?
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const freelancerWithdraw = await queryAsync(searchFreelancerWithdrawQuery, [
      freelancerId,
    ]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerWithdraw.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-withdraw", {
      title: "Freelancer Withdraw",
      freelancer_withdraw: freelancerWithdraw,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.getFreelancerPending = (req, res) => {
//   db.query(
//     "SELECT * FROM freelancer WHERE freelancer_acc_status=?",
//     [-1],
//     (error, result) => {
//       if (!error) {
//         res.render("freelancer-pending", { freelancer: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getFreelancerPending = async (req, res) => {
  try {
    const getFreelancerPendingQuery = `
      SELECT * FROM freelancer
      WHERE freelancer_acc_status = ?
    `;

    const freelancerPending = await queryAsync(getFreelancerPendingQuery, [-1]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerPending.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-pending", {
      title: "Freelancer Pending",
      freelancer: freelancerPending,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchFreelancerPending = async (req, res) => {
  try {
    const searchFreelancerPendingQuery = `
      SELECT * FROM freelancer
      WHERE freelancer_acc_status = ? AND freelancer_id = ?
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const freelancerPending = await queryAsync(searchFreelancerPendingQuery, [
      -1,
      freelancerId,
    ]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = freelancerPending.slice(startIdx, startIdx + perPage);

    return res.status(200).render("freelancer-pending", {
      title: "Freelancer Pending",
      freelancer: freelancerPending,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
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

exports.changeFreelancerStatus = async (req, res) => {
  let freelancer_id = req.params.id;

  let status = req.body.status;

  console.log(freelancer_id, status);

  const getFreelancerQuery = "SELECT * FROM freelancer WHERE freelancer_id = ?";
  const freelancer = await queryAsync(getFreelancerQuery, [freelancer_id]);

  const currentStatus = freelancer[0].freelancer_acc_status;

  if (status == 2 && currentStatus != 2) {
    const getFreelancerStatusHistoryQuery =
      "SELECT * FROM previous_status_history WHERE freelancer_id = ?";
    const freelancerStatusHistory = await queryAsync(
      getFreelancerStatusHistoryQuery,
      [freelancer_id]
    );

    console.log({ freelancerStatusHistory });

    if (freelancerStatusHistory.length > 0) {
      const updateFreelancerStatusHistoryQuery =
        "UPDATE previous_status_history SET previous_status = ? WHERE id = ?";
      await queryAsync(updateFreelancerStatusHistoryQuery, [
        currentStatus,
        freelancerStatusHistory[0].id,
      ]);
    } else {
      const insertFreelancerStatusHistoryQuery =
        "INSERT INTO previous_status_history (freelancer_id, previous_status) VALUES (?, ?)";
      await queryAsync(insertFreelancerStatusHistoryQuery, [
        freelancer_id,
        currentStatus,
      ]);
    }
  } else if (status == 3 && currentStatus != 3) {
    const getFreelancerStatusHistoryQuery =
      "SELECT * FROM previous_status_history WHERE freelancer_id = ?";
    const freelancerStatusHistory = await queryAsync(
      getFreelancerStatusHistoryQuery,
      [freelancer_id]
    );
    console.log({ freelancerStatusHistory });
    if (freelancerStatusHistory.length > 0) {
      status = freelancerStatusHistory[0].previous_status;
    }
  }

  db.query(
    "UPDATE freelancer SET freelancer_acc_status=? WHERE freelancer_id=?",
    [status, freelancer_id],
    (error, result) => {
      console.log(error, result);
      if (!error) {
        if (status == -1) {
          res.redirect("/admin/freelancer-pending");
        } else {
          res.redirect("/admin/freelancer-pending");
        }
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteFreelancer = (req, res) => {
  let freelancer_id = req.params.id;

  db.query(
    "DELETE FROM freelancer WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/freelancer");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteFreelancerEnrollment = (req, res) => {
  let freelancer_id = req.params.id;

  db.query(
    "DELETE FROM freelancer_enrollment WHERE freelancer_id=?",
    [freelancer_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/freelancer-enrollment");
      } else {
        res.send(error);
      }
    }
  );
};

// exports.getExpiredVerificationFreelancers = (req, res) => {
//   const currentDateTime = new Date();

//   const oneYearFromNow = new Date();
//   oneYearFromNow.setFullYear(currentDateTime.getFullYear() + 1);

//   const twoMinutesFromNow = new Date();
//   twoMinutesFromNow.setMinutes(currentDateTime.getMinutes() + 2);

//   db.query(
//     `SELECT freelancer.*, user.user_email, user.user_mobile_number
// FROM freelancer
// INNER JOIN user ON freelancer.user_id = user.user_id
// WHERE verification_date IS NOT NULL
//   AND freelancer_acc_status = 1
//   AND TIMESTAMPDIFF(YEAR, verification_date, NOW()) >= 1;
// `,
//     [],
//     (error, results) => {
//       if (!error) {
//         console.log(results);

//         res.render("expired-freelancers-list", { freelancer: results });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getExpiredVerificationFreelancers = async (req, res) => {
  try {
    const getExpiredVerificationFreelancersQuery = `
      SELECT freelancer.*, user.user_email, user.user_mobile_number
      FROM freelancer 
      INNER JOIN user ON freelancer.user_id = user.user_id
      WHERE verification_date IS NOT NULL 
        AND freelancer_acc_status = 1 
        AND TIMESTAMPDIFF(YEAR, verification_date, NOW()) >= 1;
    `;

    const expiredFreelancers = await queryAsyncWithoutValue(
      getExpiredVerificationFreelancersQuery
    );

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = expiredFreelancers.slice(startIdx, startIdx + perPage);

    return res.status(200).render("expired-freelancers-list", {
      title: "Expired Freelancers",
      freelancer: expiredFreelancers,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchExpiredFreelancers = async (req, res) => {
  try {
    const searchExpiredFreelancersQuery = `
      SELECT freelancer.*, user.user_email, user.user_mobile_number
      FROM freelancer 
      INNER JOIN user ON freelancer.user_id = user.user_id
      WHERE verification_date IS NOT NULL 
        AND freelancer_acc_status = 1 
        AND TIMESTAMPDIFF(YEAR, verification_date, NOW()) >= 1
        AND freelancer_id = ?;
    `;

    const searchFreelancer = req.body.search_freelancer;
    const freelancerId = searchFreelancer.replace("A-", "");

    const expiredFreelancers = await queryAsync(searchExpiredFreelancersQuery, [
      freelancerId,
    ]);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = expiredFreelancers.slice(startIdx, startIdx + perPage);

    return res.status(200).render("expired-freelancers-list", {
      title: "Expired Freelancers",
      freelancer: expiredFreelancers,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.addNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const withdraw_id = req.params.id;
    let image = "";

    if (req.file) {
      image = "https://sfinder.app/upload/" + req.file.filename;
    }

    console.log("req.files", req.file);

    const query = `
      INSERT INTO freelancer_withdraw_image (notes, image, withdraw_id)
      VALUES (?, ?, ?);
    `;

    await queryAsync(query, [notes, image, withdraw_id]);

    return res.redirect("/admin/withdraw-notes/" + withdraw_id);
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    let id = req.params.id;
    const notesQuery = `
      SELECT *
      FROM freelancer_withdraw_image
      WHERE withdraw_id = ?;
    `;

    const notes = await queryAsync(notesQuery, [id]);

    if (notes.length == 0) {
      return res.status(200).render("notes", {
        title: "Notes",
        notes: [],
        withdraw_id: id,
      });
    }

    console.log(notes[0].notes);

    return res.status(200).render("notes", {
      title: "Notes",
      notes: notes,
      withdraw_id: id,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.filter = (req, res) => {
  let status = req.body.filter_status;

  console.log(status);

  if (status) {
    return res.redirect(`/admin/freelancer-withdraw?status=${status}`);
  } else {
    return res.redirect("/admin/freelancer-withdraw");
  }
};

exports.cancel_bid = async (req, res) => {
  try {
    const cancelBidQuery = `SELECT fb.*, cb.reason, f.freelancer_name, u.user_name   FROM freelancer_bid as fb left join cancel_bid as cb on fb.freelancer_bid_id = cb.bid_id left join freelancer as f on fb.freelancer_id = f.freelancer_id left join user as u on fb.user_id = u.user_id WHERE fb.is_cancel_request = 1 AND fb.is_paid = 1 AND fb.is_done = 0`;

    const cancelBid = await queryAsync(cancelBidQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = cancelBid.slice(startIdx, startIdx + perPage);

    return res.status(200).render("bid-info", {
      title: "Bid Info",
      cancelBid: cancelBid,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.bid_info = async (req, res) => {
  try {
    const bidQuery = `SELECT fb.*, f.freelancer_name, u.user_name   FROM freelancer_bid as fb left join freelancer as f on fb.freelancer_id = f.freelancer_id left join user as u on fb.user_id = u.user_id`;

    const bid = await queryAsync(bidQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = bid.slice(startIdx, startIdx + perPage);

    return res.status(200).render("bid-info1", {
      title: "Bid Info",
      bid: bid,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.delete_bid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await queryAsync(
      `SELECT * FROM freelancer_bid WHERE freelancer_bid_id = ?`,
      [id]
    );
    const query = `UPDATE freelancer_bid SET is_cancel_request = 0, is_delete = 1, is_done = 1, is_reviewed = 1 WHERE freelancer_bid_id = ?`;
    await queryAsync(query, [id]);

    const query2 = `SELECT * FROM user_balance WHERE user_id = ?`;
    const balance = await queryAsync(query2, [bid[0].user_id]);

    if (balance.length == 0) {
      const query3 = `INSERT INTO user_balance (user_id, amount) VALUES (?, ?)`;
      await queryAsync(query3, [bid[0].user_id, 0]);
    }

    const query4 = `UPDATE user_balance SET amount = amount + ? WHERE user_id = ?`;
    await queryAsync(query4, [bid[0].bid_amount, bid[0].user_id]);

    return res.redirect("/admin/bid-info");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchBid = async (req, res) => {
  try {
    const search = req.body.search;
    const query = `SELECT fb.*, f.freelancer_name, u.user_name FROM freelancer_bid as fb left join freelancer as f on fb.freelancer_id = f.freelancer_id left join user as u on fb.user_id = u.user_id WHERE fb.freelancer_bid_id = ?`;

    const bid = await queryAsync(query, [search]);
    console.log(bid);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = bid.slice(startIdx, startIdx + perPage);

    return res.status(200).render("bid-info1", {
      title: "Bid Info",
      bid: bid,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.searchCancelBid = async (req, res) => {
  try {
    const search = req.body.search;
    const query = `SELECT fb.*, cb.reason, f.freelancer_name, u.user_name   FROM freelancer_bid as fb left join cancel_bid as cb on fb.freelancer_bid_id = cb.bid_id left join freelancer as f on fb.freelancer_id = f.freelancer_id left join user as u on fb.user_id = u.user_id WHERE fb.is_cancel_request = 1 AND fb.is_paid = 1 AND fb.is_done = 0 AND fb.freelancer_bid_id = ?`;

    const cancelBid = await queryAsync(query, [search]);
    console.log(cancelBid);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = cancelBid.slice(startIdx, startIdx + perPage);

    return res.status(200).render("bid-info", {
      title: "Cancel Bid Info",
      cancelBid: cancelBid,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
