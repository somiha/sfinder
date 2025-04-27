const db = require("../config/database");

// exports.getFileRequest = (req, res) => {
//   db.query(
//     "SELECT * FROM file_request INNER JOIN user ON user.user_id=file_request.user_id ORDER BY file_request.is_seen",
//     (error, result) => {
//       if (!error) {
//         db.query(
//           "SELECT * FROM file_request WHERE is_seen=?",
//           [0],
//           (error1, result1) => {
//             if (!error1) {
//               res.render("file-request", {
//                 file_request: result,
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
exports.getFileRequest = async (req, res) => {
  try {
    const fileRequestQuery = `SELECT * FROM file_request INNER JOIN user ON user.user_id=file_request.user_id ORDER BY file_request.is_seen`;

    const fileRequest = await queryAsyncWithoutValue(fileRequestQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const startIdx = (page - 1) * perPage;
    const paginated = fileRequest.slice(startIdx, startIdx + perPage);

    const newFileRequestQuery = `SELECT * FROM file_request WHERE is_seen=?`;
    const newFileRequest = await queryAsync(newFileRequestQuery, [0]);

    return res.status(200).render("file-request", {
      file_request: paginated,
      new_data: newFileRequest.length,
      perPage,
      page,
      fileRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteFileRequest = (req, res) => {
  let file_request_id = req.params.id;

  db.query(
    "DELETE FROM file_request WHERE file_request_id=?",
    [file_request_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/file-request");
      } else {
        res.send(error);
      }
    }
  );
};

exports.changeStatus = (req, res) => {
  let id = req.body.id;

  db.query(
    "UPDATE file_request SET is_seen=? WHERE file_request_id=?",
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
