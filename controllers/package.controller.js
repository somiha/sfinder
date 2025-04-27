const db = require("../config/database");

exports.getPackages = (req, res) => {
  db.query("SELECT * FROM packages", (error, result) => {
    if (!error) {
      res.render("packages", { package: result });
    } else {
      res.send(error);
    }
  });
};

exports.getPackageInfo = (req, res) => {
  let package_id = req.params.id;

  db.query(
    "SELECT * FROM package_info WHERE package_info.package_id=?",
    [package_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM packages WHERE package_id=?",
          [package_id],
          (error1, result1) => {
            if (!error1) {
              res.render("package-info", {
                package_info: result,
                package: result1,
              });
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

exports.addPackageInfo = (req, res) => {
  let package_id = req.params.id;
  let package_info_name = req.body.package_info_name;

  db.query(
    "INSERT INTO package_info (package_id,package_info) VALUES(?,?)",
    [package_id, package_info_name],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/package-info/" + package_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editPackageInfo = (req, res) => {
  let package_info_id = req.query.package_info_id;
  let package_id = req.query.package_id;
  let package_info_name = req.body.package_info_name;

  db.query(
    "UPDATE package_info SET package_info=? WHERE package_info_id=?",
    [package_info_name, package_info_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/package-info/" + package_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deletePackageInfo = (req, res) => {
  let package_info_id = req.query.package_info_id;
  let package_id = req.query.package_id;

  db.query(
    "DELETE FROM package_info WHERE package_info_id=?",
    [package_info_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/package-info/" + package_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.addPackage = (req, res) => {
  let package_name = req.body.package_name;
  let package_price = req.body.package_price;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO packages (package_name,package_image_url,package_price) VALUES(?,?,?)",
    [package_name, pic_url, package_price],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/packages");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editPackage = (req, res) => {
  let package_id = req.params.id;
  let package_name = req.body.package_name;
  let package_price = req.body.package_price;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";

  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE packages SET package_name=?,package_image_url=?,package_price=? WHERE package_id=?",
      [package_name, pic_url, package_price, package_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/packages");
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE packages SET package_name=?,package_price=? WHERE package_id=?",
      [package_name, package_price, package_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/packages");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deletePackage = (req, res) => {
  let package_id = req.params.id;
  db.query(
    "DELETE FROM packages WHERE package_id=?",
    [package_id],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM package_info WHERE package_id=?",
          [package_id],
          (error1, result1) => {
            if (!error1) {
              res.redirect("/admin/packages");
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
