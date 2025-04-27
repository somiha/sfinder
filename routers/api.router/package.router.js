const express = require("express");
const packageRouter = express.Router();
const db = require("../../config/database");
const upload = require("../../config/multer");

packageRouter.get("/packages", (req, res) => {
  db.query("SELECT * FROM packages", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get packages successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

packageRouter.get("/package-info", (req, res) => {
  let package_id = req.query.package_id;

  db.query(
    "SELECT * FROM package_info WHERE package_id=?",
    [package_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get package info successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

packageRouter.post("/package-enrollment", upload.none(), (req, res) => {
  let package_id = req.query.package_id;
  let user_id = req.query.user_id;
  let status = 1;

  db.query(
    "SELECT * FROM package_enrollment WHERE user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "failed",
            message: "Already enrolled",
            data: [],
          });
        } else {
          db.query(
            "INSERT INTO package_enrollment (package_id,user_id,status) VALUES(?,?,?)",
            [package_id, user_id, status],
            (error, result) => {
              if (!error) {
                res.send({
                  status: "success",
                  message: "Package enrollment successfully",
                  data: [],
                });
              } else {
                res.send(error);
              }
            }
          );
        }
      } else {
        res.send(error);
      }
    }
  );
});

packageRouter.get("/is-package-enrolled", (req, res) => {
  let user_id = req.query.user_id;

  db.query(
    "SELECT * FROM package_enrollment INNER JOIN packages ON packages.package_id=package_enrollment.package_id WHERE package_enrollment.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "success",
            message: "This user enrolled",
            data: result,
          });
        } else {
          res.send({
            status: "failed",
            message: "This user not enrolled",
            data: [],
          });
        }
      } else {
        res.send(error);
      }
    }
  );
});

packageRouter.post("/update-package", (req, res) => {
  let user_id = req.query.user_id;
  let package_id = req.body.package_id;

  db.query(
    "UPDATE package_enrollment SET package_id=? WHERE user_id=?",
    [package_id, user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Update package successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

module.exports = packageRouter;
