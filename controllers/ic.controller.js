const db = require("../config/database");

// exports.getIc = (req, res) => {
//   db.query("SELECT * FROM ic_list", (error, result) => {
//     if (!error) {
//       res.render("ic", { ic: result });
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

exports.getIc = async (req, res) => {
  try {
    const icQuery = `SELECT * FROM ic_list`;

    const ic = await queryAsyncWithoutValue(icQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = ic.slice(startIdx, startIdx + perPage);

    return res.status(200).render("ic", {
      title: "IC List",
      ic,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addIc = (req, res) => {
  let ic_brand = req.body.ic_brand;
  let ic_model = req.body.ic_model;
  let ic_part = req.body.ic_part;
  let ic_code = req.body.ic_code;
  let ic_location = req.body.ic_location;
  let ic_description = req.body.ic_description;

  db.query(
    "INSERT INTO ic_list(ic_brand,ic_model,ic_description,ic_part_no,ic_code,ic_location) VALUES(?,?,?,?,?,?)",
    [ic_brand, ic_model, ic_description, ic_part, ic_code, ic_location],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/ic");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editIc = (req, res) => {
  let id = req.params.id;
  let ic_brand = req.body.ic_brand;
  let ic_model = req.body.ic_model;
  let ic_part = req.body.ic_part;
  let ic_code = req.body.ic_code;
  let ic_location = req.body.ic_location;
  let ic_description = req.body.ic_description;

  db.query(
    "UPDATE ic_list SET ic_brand=?,ic_model=?,ic_description=?,ic_part_no=?,ic_code=?,ic_location=? WHERE ic_id=?",
    [ic_brand, ic_model, ic_description, ic_part, ic_code, ic_location, id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/ic");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteIc = (req, res) => {
  let id = req.params.id;

  db.query("DELETE FROM ic_list WHERE ic_id=?", [id], (error, result) => {
    if (!error) {
      res.redirect("/admin/ic");
    } else {
      res.send(error);
    }
  });
};
