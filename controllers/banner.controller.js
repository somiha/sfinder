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
// exports.getBanner = (req, res) => {
//   db.query("SELECT * FROM banners", (error, result) => {
//     if (!error) {
//       res.render("banner", { banner: result });
//     } else {
//       res.send(error);
//     }
//   });
// };

exports.getBanner = async (req, res) => {
  try {
    const bannerQuery = `SELECT * FROM banners`;

    const banners = await queryAsyncWithoutValue(bannerQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;
    const paginated = banners.slice(startIdx, startIdx + perPage);

    return res.status(200).render("banner", {
      title: "Banner List",
      banners,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addBanner = (req, res) => {
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO banners(banner_image_url) VALUES(?)",
    [pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/banner");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editBanner = (req, res) => {
  let banner_id = req.query.banner_id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE banners SET banner_image_url=? WHERE banners_id=?",
      [pic_url, banner_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/banner");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteBanner = (req, res) => {
  let banner_id = req.params.id;

  db.query(
    "DELETE FROM banners WHERE banners_id=?",
    [banner_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/banner");
      } else {
        res.send(error);
      }
    }
  );
};
