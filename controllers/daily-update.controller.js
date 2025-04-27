const db = require("../config/database");
const moment = require("moment");

// exports.getdailyUpdate = (req, res) => {
//   db.query("SELECT * FROM daily_update", (error, result) => {
//     if (!error) {
//       res.render("daily-update", { daily_update: result, moment: moment });
//     } else {
//       res.send(error);
//     }
//   });
// };

exports.getdailyUpdate = async (req, res) => {
  try {
    const dailyUpdateQuery = `SELECT * FROM daily_update`;
    const dailyUpdates = await queryAsyncWithoutValue(dailyUpdateQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;

    const paginatedUpdates = dailyUpdates.slice(startIdx, startIdx + perPage);

    return res.render("daily-update", {
      title: "Daily Updates",
      daily_update: dailyUpdates,
      paginated: paginatedUpdates,
      perPage,
      page,
      moment: moment,
    });
  } catch (error) {
    console.log("Error fetching daily updates:", error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

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

exports.addDailyUpdate = (req, res) => {
  let daily_update_condition = req.body.daily_update_condition;
  let daily_update_description = req.body.daily_update_description;
  let daily_update_date = req.body.daily_update_date;
  let daily_update_final_date = moment(daily_update_date).format("DD-MM-YYYY");

  db.query(
    "INSERT INTO daily_update(date,description,status) VALUES(?,?,?)",
    [daily_update_final_date, daily_update_description, daily_update_condition],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/daily-update");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteDailyUpdate = (req, res) => {
  let id = req.params.id;

  db.query(
    "DELETE FROM daily_update WHERE daily_update_id=?",
    [id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/daily-update");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editDailyUpdate = (req, res) => {
  let id = req.params.id;
  let daily_update_condition = req.body.daily_update_condition;
  let daily_update_description = req.body.daily_update_description;
  let daily_update_date = req.body.daily_update_date;
  let daily_update_final_date = moment(daily_update_date).format("DD-MM-YYYY");

  db.query(
    "UPDATE daily_update SET date=?,description=?,status=? WHERE daily_update_id=?",
    [
      daily_update_final_date,
      daily_update_description,
      daily_update_condition,
      id,
    ],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/daily-update");
      } else {
        res.send(error);
      }
    }
  );
};
