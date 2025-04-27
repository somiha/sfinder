const db = require("../config/database");

exports.getSettings = (req, res) => {
  db.query("SELECT * FROM social_media_links", (error, result) => {
    if (!error) {
      db.query("SELECT * FROM general_info", (error1, result1) => {
        if (!error1) {
          db.query("SELECT * FROM home_notification", (error2, result2) => {
            if (!error2) {
              db.query("SELECT * FROM alert", (error3, result3) => {
                if (!error3) {
                  db.query(
                    "SELECT * FROM contact_us_info",
                    (error4, result4) => {
                      if (!error4) {
                        res.render("settings", {
                          social_media_info: result,
                          general_info: result1,
                          home_notification: result2,
                          alert: result3,
                          contact_us_info: result4,
                        });
                      }
                    }
                  );
                } else {
                  res.send(error3);
                }
              });
            } else {
              res.send(error2);
            }
          });
        } else {
          res.send(error1);
        }
      });
    } else {
      res.send(error);
    }
  });
};

exports.editSocialMediaInfo = (req, res) => {
  let facebook_link = req.body.facebook_link;
  let whatsapp_link = req.body.whatsapp_link;

  db.query(
    "UPDATE social_media_links SET facebook_link=?,whatsapp_link=?",
    [facebook_link, whatsapp_link],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/settings");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editGenaralInfo = (req, res) => {
  let terms_policy_info = req.body.terms_policy_info;
  let home_notification = req.body.home_notification;
  let freelancer_fee = req.body.freelancer_fee;
  let version_name = req.body.version_name;
  let version_url = req.body.version_url;
  let home_video_thumbnail_image = "";
  let home_video = "";
  let isMultipleDeviceAllowed = req.body?.isMultipleDeviceAllowed ? 1 : 0;

  if (req.files.home_video_thumbnail_image && req.files.home_video) {
    home_video_thumbnail_image =
      "https://sfinder.app/upload/" +
      req.files.home_video_thumbnail_image[0].filename;
    home_video =
      "https://sfinder.app/upload/" + req.files.home_video[0].filename;
    db.query(
      "UPDATE general_info SET terms_policy=?,home_video_url=?,home_video_thumbnail=?,freelancer_fee=?, version_name=?,version_url=?,isMultipleDeviceAllowed=?",
      [
        terms_policy_info,
        home_video,
        home_video_thumbnail_image,
        freelancer_fee,
        version_name,
        version_url,
        isMultipleDeviceAllowed,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE home_notification SET notification=?",
            [home_notification],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/settings");
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
  } else if (req.files.home_video_thumbnail_image) {
    home_video_thumbnail_image =
      "https://sfinder.app/upload/" +
      req.files.home_video_thumbnail_image[0].filename;
    db.query(
      "UPDATE general_info SET terms_policy=?,home_video_thumbnail=?,freelancer_fee=?, version_name=?,version_url=?,isMultipleDeviceAllowed=?",
      [
        terms_policy_info,
        home_video_thumbnail_image,
        freelancer_fee,
        version_name,
        version_url,
        isMultipleDeviceAllowed,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE home_notification SET notification=?",
            [home_notification],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/settings");
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
  } else if (req.files.home_video) {
    home_video =
      "https://sfinder.app/upload/" + req.files.home_video[0].filename;
    db.query(
      "UPDATE general_info SET terms_policy=?,home_video_url=?,freelancer_fee=?, version_name=?,version_url=?,isMultipleDeviceAllowed=?",
      [
        terms_policy_info,
        home_video,
        freelancer_fee,
        version_name,
        version_url,
        isMultipleDeviceAllowed,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE home_notification SET notification=?",
            [home_notification],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/settings");
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
  } else {
    db.query(
      "UPDATE general_info SET terms_policy=?,freelancer_fee=?, version_name=?,version_url=?,isMultipleDeviceAllowed=?",
      [
        terms_policy_info,
        freelancer_fee,
        version_name,
        version_url,
        isMultipleDeviceAllowed,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE home_notification SET notification=?",
            [home_notification],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/settings");
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
  }
};

exports.addAlert = (req, res) => {
  let alert_title = req.body.alert_title;
  let alert_description = req.body.alert_description;
  let is_active = req.body.is_active;
  let alert_image = "";
  let alert_file = "";
  alert_image =
    "https://sfinder.app/upload/" + req.files.alert_image[0].filename;
  alert_file = "https://sfinder.app/upload/" + req.files.alert_file[0].filename;

  db.query(
    "INSERT INTO alert (alert_name,alert_description,alert_image_url,alert_file_url,is_active) VALUES(?,?,?,?,?)",
    [alert_title, alert_description, alert_image, alert_file, is_active],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/settings");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editAlert = (req, res) => {
  let alert_id = req.params.id;
  let is_active = req.body.is_active;
  let alert_image = "";
  let alert_file = "";
  let alert_link = req.body.alert_link;

  if (alert_link) {
    db.query(
      "UPDATE alert SET link=? WHERE alert_id=?",
      [alert_link, alert_id],
      (error, result) => {}
    );
  }

  if (req.files.alert_image && req.files.alert_file) {
    alert_image =
      "https://sfinder.app/upload/" + req.files.alert_image[0].filename;
    alert_file =
      "https://sfinder.app/upload/" + req.files.alert_file[0].filename;

    db.query(
      "UPDATE alert SET alert_image_url=?,alert_file_url=?,is_active=? WHERE alert_id=?",
      [alert_image, alert_file, is_active, alert_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/settings");
        } else {
          res.send(error);
        }
      }
    );
  } else if (req.files.alert_image) {
    alert_image =
      "https://sfinder.app/upload/" + req.files.alert_image[0].filename;

    db.query(
      "UPDATE alert SET alert_image_url=?,is_active=? WHERE alert_id=?",
      [alert_image, is_active, alert_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/settings");
        } else {
          res.send(error);
        }
      }
    );
  } else if (req.files.alert_file) {
    alert_file =
      "https://sfinder.app/upload/" + req.files.alert_file[0].filename;
    db.query(
      "UPDATE alert SET alert_file_url=?,is_active=? WHERE alert_id=?",
      [alert_file, is_active, alert_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/settings");
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE alert SET is_active=? WHERE alert_id=?",
      [is_active, alert_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/settings");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteAlert = (req, res) => {
  let alert_id = req.params.id;

  db.query(
    "DELETE FROM alert WHERE alert_id =?",
    [alert_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/settings");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editContactUsInfo = (req, res) => {
  let email = req.body.email;
  let mobile_number = req.body.mobile_number;
  let address = req.body.address;

  db.query(
    "UPDATE contact_us_info SET email=?,mobile_number=?,address=?",
    [email, mobile_number, address],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/settings");
      } else {
        res.send(error);
      }
    }
  );
};
