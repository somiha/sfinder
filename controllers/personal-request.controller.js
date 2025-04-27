const db = require("../config/database");

// exports.getPersonalRequest = (req, res) => {
//   db.query(
//     "SELECT * FROM personal_request_content INNER JOIN user ON user.user_id=personal_request_content.user_id ORDER BY personal_request_content.is_seen",
//     (error, result) => {
//       if (!error) {
//         db.query(
//           "SELECT * FROM personal_request_content WHERE is_seen=?",
//           [0],
//           (error1, result1) => {
//             if (!error1) {
//               res.render("personal-request", {
//                 personal_request: result,
//                 new_data: result1.length,
//               });
//             } else {
//               res.send(error1);
//             }
//           }
//         );
//       } else {
//         res.send(error);
//       }
//     }
//   );
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

exports.getPersonalRequest = async (req, res) => {
  try {
    const personalRequestQuery = `SELECT * FROM personal_request_content INNER JOIN user ON user.user_id=personal_request_content.user_id ORDER BY personal_request_content.is_seen`;

    const personalRequest = await queryAsyncWithoutValue(personalRequestQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const startIdx = (page - 1) * perPage;
    const paginated = personalRequest.slice(startIdx, startIdx + perPage);

    const newPersonalRequestQuery = `SELECT * FROM personal_request_content WHERE is_seen=?`;
    const newPersonalRequest = await queryAsync(newPersonalRequestQuery, [0]);

    return res.status(200).render("personal-request", {
      personal_request: paginated,
      new_data: newPersonalRequest.length,
      perPage,
      page,
      personalRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.deletePersonalRequest = (req, res) => {
  let personal_request_id = req.params.id;

  db.query(
    "DELETE FROM personal_request_content WHERE personal_request_content_id=?",
    [personal_request_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/personal-request");
      } else {
        res.send(error);
      }
    }
  );
};

exports.changeStauts = (req, res) => {
  let id = req.body.id;

  db.query(
    "UPDATE personal_request_content SET is_seen=? WHERE personal_request_content_id=?",
    [1, id],
    (error, result) => {
      if (!error) {
        res.send("success");
      } else {
        res.send(error);
      }
    }
  );
};
