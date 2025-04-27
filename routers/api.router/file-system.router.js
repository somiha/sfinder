const express = require("express");
const fileSystemRouter = express.Router();
const db = require("../../config/database");

fileSystemRouter.get("/mobile-company", (req, res) => {
  db.query("SELECT * FROM mobile_company", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get mobile company successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

fileSystemRouter.get("/file-system", (req, res) => {
  let mobile_company_id = req.query.mobile_company_id;
  db.query(
    "SELECT * FROM main_folder WHERE mobile_company=?",
    [mobile_company_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          db.query(
            "SELECT * FROM sub_folder INNER JOIN main_folder ON main_folder.main_folder_id=sub_folder.main_folder",
            (error1, result1) => {
              if (!error1) {
                db.query(
                  "SELECT * FROM file INNER JOIN sub_folder ON sub_folder.sub_folder_id=file.sub_folder",
                  (error3, result3) => {
                    if (!error3) {
                      res.send({
                        status: "success",
                        message: "Get file system successfully",
                        main_folder: result,
                        sub_folder: result1,
                        file: result3,
                        data: [],
                      });
                    } else {
                      res.send(error3);
                    }
                  }
                );
              } else {
                res.send(error1);
              }
            }
          );
        } else {
          res.send({
            status: "failed",
            message: "No file system",
            data: [],
          });
        }
      } else {
        res.send(error);
      }
    }
  );
});

SelectFiles = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM file WHERE extra_folder=?",
      [id],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};

fileSystemRouter.get("/files-by-sub-folder", (req, res) => {
  let sub_folder_id = req.query.sub_folder_id;
  let files = [];
  db.query(
    "SELECT * FROM extra_folder WHERE sub_folder=?",
    [sub_folder_id],
    async (error, result) => {
      if (!error) {
        for (let i = 0; i < result.length; i++) {
          try {
            const resultElements = await SelectFiles(result[i].extra_folder_id);
            files.push(resultElements);
          } catch (e) {
            res.send(e);
          }
        }
        let finalArr = [];
        for (let q = 0; q < files.length; q++) {
          for (let w = 0; w < files[q].length; w++) {
            finalArr.push(files[q][w]);
          }
        }
        res.send({
          status: "success",
          message: "get files successfully",
          data: finalArr,
        });
      } else {
        res.send(error);
      }
    }
  );
});

module.exports = fileSystemRouter;
