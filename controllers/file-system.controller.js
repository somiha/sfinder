const db = require("../config/database");

exports.getFileSystem = (req, res) => {
  db.query("SELECT * FROM mobile_company", (error, result) => {
    if (!error) {
      res.render("file-system", {
        mobile_company: result,
      });
    } else {
      res.send(error);
    }
  });
};

exports.addMobileCompany = (req, res) => {
  let mobile_company_name = req.body.mobile_company_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO mobile_company (mobile_company_name,mobile_company_logo) VALUES(?,?)",
    [mobile_company_name, pic_url],
    (error, result) => {
      if (!error) {
        if (!error) {
          res.redirect("/admin/file-system");
        } else {
          res.send(error);
        }
      }
    }
  );
};

exports.editMobileCompany = (req, res) => {
  let mobile_company_id = req.params.id;
  let mobile_company_name = req.body.mobile_company_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE mobile_company SET mobile_company_name=?,mobile_company_logo=? WHERE mobile_company_id=?",
      [mobile_company_name, pic_url, mobile_company_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/file-system");
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE mobile_company SET mobile_company_name=? WHERE mobile_company_id=?",
      [mobile_company_name, mobile_company_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/file-system");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteMobileCompany = (req, res) => {
  let mobile_company_id = req.params.id;
  db.query(
    "DELETE FROM mobile_company WHERE mobile_company_id =?",
    [mobile_company_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/file-system");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getMainFolder = (req, res) => {
  let mobile_company_id = req.params.id;
  db.query(
    "SELECT * FROM main_folder INNER JOIN mobile_company ON mobile_company.mobile_company_id=main_folder.mobile_company WHERE main_folder.mobile_company=?",
    [mobile_company_id],
    (error1, result1) => {
      if (!error1) {
        res.render("main-folder", {
          main_folder: result1,
          mobile_company_id: mobile_company_id,
        });
      } else {
        res.send(error1);
      }
    }
  );
};

exports.addMainFolder = (req, res) => {
  let main_folder_name = req.body.main_folder_name;
  let mobile_company = req.body.mobile_company;

  db.query(
    "INSERT INTO main_folder(main_folder_name,mobile_company) VALUES(?,?)",
    [main_folder_name, mobile_company],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/main-folder/" + mobile_company);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editMainFolder = (req, res) => {
  let main_folder_id = req.params.id;
  let main_folder_name = req.body.main_folder_name;
  let mobile_company = req.body.mobile_company;

  db.query(
    "UPDATE main_folder SET main_folder_name=?,mobile_company=? WHERE main_folder_id=?",
    [main_folder_name, mobile_company, main_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/main-folder/" + mobile_company);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteMainFolder = (req, res) => {
  let main_folder_id = req.query.main_folder_id;
  let mobile_company_id = req.query.mobile_company_id;

  db.query(
    "DELETE FROM main_folder WHERE main_folder_id=?",
    [main_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/main-folder/" + mobile_company_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getSubFolder = (req, res) => {
  let main_folder_id = req.params.id;

  db.query(
    "SELECT * FROM sub_folder WHERE main_folder=?",
    [main_folder_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM main_folder INNER JOIN mobile_company ON mobile_company.mobile_company_id=main_folder.mobile_company WHERE main_folder.main_folder_id=?",
          [main_folder_id],
          (error1, companies) => {
            console.log(companies);
            if (!error1) {
              db.query("SELECT * FROM main_folder", (error2, result1) => {
                if (!error2) {
                  res.render("sub-folder", {
                    sub_folder: result,
                    main_folder: result1,
                    companies: companies,
                    main_folder_id: main_folder_id,
                  });
                } else {
                  res.send(error2);
                }
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

exports.addSubFolder = (req, res) => {
  let main_folder_id = req.params.id;
  let sub_folder_name = req.body.sub_folder_name;

  db.query(
    "INSERT INTO sub_folder (sub_folder_name,main_folder) VALUES(?,?)",
    [sub_folder_name, main_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/sub-folder/" + main_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editSubFolder = (req, res) => {
  let sub_folder_id = req.query.sub_folder_id;
  let main_folder_id = req.query.main_folder_id;
  let sub_folder_name = req.body.sub_folder_name;

  db.query(
    "UPDATE sub_folder SET sub_folder_name=? WHERE sub_folder_id=?",
    [sub_folder_name, sub_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/sub-folder/" + main_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteSubFolder = (req, res) => {
  let sub_folder_id = req.query.sub_folder_id;
  let main_folder_id = req.query.main_folder_id;

  db.query(
    "DELETE FROM sub_folder WHERE sub_folder_id=?",
    [sub_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/sub-folder/" + main_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getExtraFolder = (req, res) => {
  let sub_folder_id = req.params.id;
  db.query(
    "SELECT * FROM extra_folder WHERE sub_folder=?",
    [sub_folder_id],
    (error, result) => {
      if (!error) {
        res.render("extra-folder", {
          extra_folder: result,
          sub_folder_id: sub_folder_id,
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.addExtraFolder = (req, res) => {
  let sub_folder_id = req.params.id;
  let extra_folder_name = req.body.extra_folder_name;

  db.query(
    "INSERT INTO extra_folder (extra_folder_name,sub_folder) VALUES(?,?)",
    [extra_folder_name, sub_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/extra-folder/" + sub_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editExtraFolder = (req, res) => {
  let extra_folder_id = req.query.extra_folder_id;
  let sub_folder_id = req.query.sub_folder_id;
  let extra_folder_name = req.body.extra_folder_name;

  db.query(
    "UPDATE extra_folder SET extra_folder_name=? WHERE extra_folder_id=?",
    [extra_folder_name, extra_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/extra-folder/" + sub_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteExtraFolder = (req, res) => {
  let extra_folder_id = req.query.extra_folder_id;
  let sub_folder_id = req.query.sub_folder_id;

  db.query(
    "DELETE FROM extra_folder WHERE extra_folder_id=?",
    [extra_folder_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/extra-folder/" + sub_folder_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getFiles = (req, res) => {
  let sub_folder_id = req.params.id;
  let isExtraFolder = req.query.is_extra_folder;

  if (isExtraFolder) {
    db.query(
      "SELECT * FROM file WHERE sub_folder_id=?",
      [sub_folder_id],
      (error, result) => {
        console.log({ result });
        if (!error) {
          return res.render("file", {
            file: result,
            sub_folder_id: sub_folder_id,
          });
        } else {
          return res.send(error);
        }
      }
    );
  } else {
    db.query(
      "SELECT * FROM file WHERE sub_folder=?",
      [sub_folder_id],
      (error, result) => {
        if (!error) {
          res.render("file", {
            file: result,
            extra_folder_id: sub_folder_id,
            sub_folder_id: sub_folder_id,
          });
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.addFile = (req, res) => {
  let sub_folder_id = req.params.id;
  let file_name = req.body.file_name;
  let file_url = "";
  let is_special = req.query.is_special;
  const filesrc = req.file ? req.file.filename : "";
  if (filesrc) {
    file_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  if (is_special) {
    db.query(
      "INSERT INTO file (file_name,file_url,sub_folder_id, sub_folder) VALUES(?,?,?,?)",
      [file_name, file_url, sub_folder_id, sub_folder_id],
      (error, result) => {
        if (!error) {
          return res.redirect(
            "/admin/files/" + sub_folder_id + "?is_extra_folder=1"
          );
        } else {
          return res.send(error);
        }
      }
    );
  } else {
    db.query(
      "INSERT INTO file (file_name,file_url,sub_folder) VALUES(?,?,?)",
      [file_name, file_url, sub_folder_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/files/" + sub_folder_id);
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.editFile = (req, res) => {
  let file_id = req.query.file_id;
  let extra_folder_id = req.query.extra_folder_id;
  let file_name = req.body.file_name;
  let file_url = "";
  let is_special = req.query.is_special;
  const filesrc = req.file ? req.file.filename : "";
  if (filesrc) {
    file_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE file SET file_name=?,file_url=? WHERE file_id=?",
      [file_name, file_url, file_id],
      (error, result) => {
        if (!error) {
          if (is_special) {
            return res.redirect(
              "/admin/files/" + extra_folder_id + "?is_extra_folder=1"
            );
          }
          res.redirect("/admin/files/" + extra_folder_id);
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE file SET file_name=? WHERE file_id=?",
      [file_name, file_id],
      (error, result) => {
        if (!error) {
          if (is_special) {
            console.log("is_special");
            return res.redirect(
              "/admin/files/" + extra_folder_id + "?is_extra_folder=1"
            );
          }
          res.redirect("/admin/files/" + extra_folder_id);
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteFile = (req, res) => {
  let file_id = req.query.file_id;
  let extra_folder_id = req.query.extra_folder_id;
  let is_special = req.query.is_special;

  db.query("DELETE FROM file WHERE file_id=?", [file_id], (error, result) => {
    if (!error) {
      console.log({ is_special });
      if (is_special) {
        return res.redirect(
          "/admin/files/" + extra_folder_id + "?is_extra_folder=1"
        );
      } else {
        return res.redirect("/admin/files/" + extra_folder_id);
      }
    } else {
      return res.send(error);
    }
  });
};
