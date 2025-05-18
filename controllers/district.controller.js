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

exports.getAllDistricts = async (req, res) => {
  try {
    const query = `SELECT district.*, division.division_name
FROM district
INNER JOIN division ON division.division_id = district.division_id;
`;
    const result = await queryAsyncWithoutValue(query);

    const query1 = `SELECT * FROM division`;
    const division = await queryAsyncWithoutValue(query1);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const totalDistricts = result.length;
    const totalPages = Math.ceil(totalDistricts / perPage);
    const paginated = result.slice(startIdx, startIdx + perPage);

    console.log(paginated);

    return res.status(200).render("district", {
      title: "Districts",
      districts: paginated,
      division,
      perPage,
      page,
      totalDistricts,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.addDistrict = async (req, res) => {
  try {
    const { name, division_id } = req.body;
    const query = `INSERT INTO district (district_name, division_id) VALUES (?, ?)`;
    await queryAsync(query, [name, division_id]);
    return res.redirect("/admin/district");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.editDistrict = async (req, res) => {
  try {
    const { name, division_id } = req.body;
    const { id } = req.params;
    const query = `UPDATE district SET district_name = ?, division_id = ? WHERE district_id = ?`;
    await queryAsync(query, [name, division_id, id]);
    return res.redirect("/admin/district");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM district WHERE district_id = ?`;
    await queryAsync(query, [id]);
    return res.redirect("/admin/district");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
