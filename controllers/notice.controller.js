const db = require("../config/database");
const moment = require("moment");

// exports.getNotice = (req, res) => {
//   db.query("SELECT * FROM notice", (error, result) => {
//     if (!error) {
//       res.render("notice", { notice: result, moment: moment });
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

exports.getNotice = async (req, res) => {
  try {
    const noticeQuery = `SELECT * FROM notice`;

    const notice = await queryAsyncWithoutValue(noticeQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = notice.slice(startIdx, startIdx + perPage);

    return res.status(200).render("notice", {
      title: "Notice",
      notice,
      paginated,
      perPage,
      page,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addNotice = (req, res) => {
  let notice_title = req.body.notice_title;
  let notice_date = req.body.notice_date;
  let notice_status = req.body.notice_status;
  let notice_description = req.body.notice_description;
  let notice_final_date = moment(notice_date).format("DD-MM-YYYY");

  db.query(
    "INSERT INTO notice(notice_title,notice_description,notice_date,notice_status) VALUES(?,?,?,?)",
    [notice_title, notice_description, notice_final_date, notice_status],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/notice");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteNotice = (req, res) => {
  let notice_id = req.params.id;

  db.query(
    "DELETE FROM notice WHERE notice_id=?",
    [notice_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/notice");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editNotice = (req, res) => {
  let notice_id = req.params.id;
  let notice_title = req.body.notice_title;
  let notice_date = req.body.notice_date;
  let notice_status = req.body.notice_status;
  let notice_description = req.body.notice_description;
  let notice_final_date = moment(notice_date).format("DD-MM-YYYY");

  db.query(
    "UPDATE notice SET notice_title=?,notice_description=?,notice_date=?,notice_status=? WHERE notice_id=?",
    [
      notice_title,
      notice_description,
      notice_final_date,
      notice_status,
      notice_id,
    ],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/notice");
      } else {
        res.send(error);
      }
    }
  );
};
