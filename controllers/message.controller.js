const db = require("../config/database");

// exports.getMessage = (req, res) => {
//   db.query(
//     "SELECT * FROM message INNER JOIN user ON user.user_id=message.user_id ORDER BY message.is_seen",
//     (error, result) => {
//       if (!error) {
//         db.query(
//           "SELECT * FROM message WHERE is_seen=?",
//           [0],
//           (error1, result1) => {
//             if (!error1) {
//               res.render("message", {
//                 message: result,
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
exports.getMessage = async (req, res) => {
  try {
    const messageQuery = `
      SELECT * 
      FROM message 
      INNER JOIN user 
      ON user.user_id = message.user_id
      ORDER BY message.is_seen`;

    const unseenCountQuery = `SELECT COUNT(*) AS unseen_count FROM message WHERE is_seen = 0`;

    const messages = await queryAsyncWithoutValue(messageQuery);

    const unseenCountResult = await queryAsyncWithoutValue(unseenCountQuery);
    const unseenCount = unseenCountResult[0].unseen_count;

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const startIdx = (page - 1) * perPage;

    const paginatedMessages = messages.slice(startIdx, startIdx + perPage);

    return res.render("message", {
      message: paginatedMessages,
      new_data: unseenCount,
      perPage,
      page,
      totalMessages: messages.length,
      messages,
    });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteMessage = (req, res) => {
  let message_id = req.params.id;

  db.query(
    "DELETE FROM message WHERE message_id=?",
    [message_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/message");
      } else {
        res.send(error);
      }
    }
  );
};

exports.changeMessageStatus = (req, res) => {
  let id = req.body.id;

  db.query(
    "UPDATE message SET is_seen=? WHERE message_id=?",
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
