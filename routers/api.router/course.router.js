const express = require("express");
const courseRouter = express.Router();
const db = require("../../config/database");
const moment = require("moment");

courseRouter.get("/course-category", (req, res) => {
  const query = `
    SELECT 
        cc.course_category_id, 
        cc.course_category_name, 
        cc.course_category_icon, 
        COUNT(c.course_id) AS course_count
    FROM 
        course_category cc
    LEFT JOIN 
        course c ON cc.course_category_id = c.course_category
    GROUP BY 
        cc.course_category_id, cc.course_category_name, cc.course_category_icon;
  `;

  db.query(query, (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get course category successfully",
        data: result,
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Failed to fetch course categories",
        error: error.message,
      });
    }
  });
});

courseRouter.get("/all-courses", (req, res) => {
  db.query(
    "SELECT * FROM course INNER JOIN course_instructor ON course_instructor.course_instructor_id=course.course_instructor",
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get courses successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

courseRouter.get("/course-by-category", (req, res) => {
  let category_id = req.query.category_id;
  db.query(
    "SELECT * FROM course INNER JOIN course_instructor ON course_instructor.course_instructor_id=course.course_instructor WHERE course.course_category=?",
    [category_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get course category successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

courseRouter.get("/course-details", (req, res) => {
  let course_id = req.query.course_id;
  db.query(
    "SELECT * FROM course INNER JOIN course_category ON course_category.course_category_id=course.course_category WHERE course.course_id=?",
    [course_id],
    (error, result) => {
      if (!error) {
        let course_instructor_id = result[0].course_instructor;
        db.query(
          "SELECT * FROM course_extra_info WHERE course_id=?",
          [course_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM course_instructor WHERE course_instructor_id=?",
                [course_instructor_id],
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "SELECT * FROM course_benefit WHERE course_id=?",
                      [course_id],
                      (error3, result3) => {
                        if (!error3) {
                          db.query(
                            "SELECT * FROM course_material WHERE course_id=?",
                            [course_id],
                            (error4, result4) => {
                              if (!error4) {
                                res.send({
                                  status: "success",
                                  message: "Get course details successfully",
                                  course_main_info: result,
                                  course_extra_info: result1,
                                  course_instructor: result2,
                                  course_benefit: result3,
                                  course_material: result4,
                                  data: [],
                                });
                              } else {
                                res.send(error4);
                              }
                            }
                          );
                        } else {
                          res.send(error3);
                        }
                      }
                    );
                  } else {
                    res.send(error2);
                  }
                }
              );
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
});

courseRouter.post("/course-enrollment", (req, res) => {
  let user_id = req.query.user_id;
  let course_id = req.query.course_id;
  let payment_method = req.body.payment_method;
  let enrollment_account = req.body.enrollment_account;
  let amount = req.body.amount;

  // let purchase_time = moment()
  //   .utcOffset("+06:00")
  //   .format("YYYY-MM-DD HH:mm:ss");
  // let end_time = moment(purchase_time)
  //   .add(6, "months")
  //   .format("YYYY-MM-DD HH:mm:ss");

  let status = 1;

  db.query(
    `INSERT INTO course_enrollment 
    (user_id, course_id, payment_method, enrollment_account, amount, status, purchase_time, end_time, is_active) 
   VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), 1)`,
    [user_id, course_id, payment_method, enrollment_account, amount, status],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Course enrollment successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

courseRouter.get("/remove-enrollment", (req, res) => {
  const sql = `
    UPDATE course_enrollment 
    SET is_active = 0 
    WHERE end_time < NOW() AND is_active = 1
  `;

  db.query(sql, (error, result) => {
    console.log();

    if (!error) {
      res.send({
        status: "success",
        message: "Expired enrollments deactivated successfully",
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Failed to deactivate expired enrollments",
        error,
      });
    }
  });
});

module.exports = courseRouter;
