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

// exports.getAppImage = (req, res) => {
//   db.query("SELECT * FROM app_image", (error, result) => {
//     if (!error) {
//       res.render("app-image", { app_image: result });
//     } else {
//       res.send(error);
//     }
//   });
// };

exports.getAppImage = async (req, res) => {
  try {
    const appImageQuery = `SELECT * FROM app_image`;

    const appImage = await queryAsyncWithoutValue(appImageQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = appImage.slice(startIdx, startIdx + perPage);

    return res.status(200).render("app-image", {
      title: "Banner List",
      appImage,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addAppImage = (req, res) => {
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO app_image(app_image_url) VALUES(?)",
    [pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/app-image");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editAppImage = (req, res) => {
  let app_image_id = req.query.app_image_id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE app_image SET app_image_url=? WHERE app_image_id=?",
      [pic_url, app_image_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/app-image");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteAppImage = (req, res) => {
  let app_image_id = req.params.id;

  db.query(
    "DELETE FROM app_image WHERE app_image_id=?",
    [app_image_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/app-image");
      } else {
        res.send(error);
      }
    }
  );
};
