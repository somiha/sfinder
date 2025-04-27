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

exports.getAllDivisions = async (req, res) => {
  try {
    const query = `SELECT * FROM division`;
    const result = await queryAsyncWithoutValue(query);

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const startIdx = (page - 1) * perPage;
    const totalDivisions = result.length;
    const totalPages = Math.ceil(totalDivisions / perPage);
    const paginated = result.slice(startIdx, startIdx + perPage);

    console.log(paginated);

    return res.status(200).render("division", {
      title: "Divisions",
      divisions: paginated,
      perPage,
      page,
      totalDivisions,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.addDivision = async (req, res) => {
  try {
    const { name } = req.body;
    const query = `INSERT INTO division (division_name) VALUES (?)`;
    await queryAsync(query, [name]);
    return res.redirect("/admin/division");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.editDivision = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const query = `UPDATE division SET division_name = ? WHERE division_id = ?`;
    await queryAsync(query, [name, id]);
    return res.redirect("/admin/division");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM division WHERE division_id = ?`;
    await queryAsync(query, [id]);
    return res.redirect("/admin/division");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
