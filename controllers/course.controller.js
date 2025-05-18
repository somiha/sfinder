const db = require("../config/database");
const moment = require("moment-timezone");

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

exports.getCourse = (req, res) => {
  db.query(
    "SELECT * FROM course INNER JOIN course_instructor ON course_instructor.course_instructor_id=course.course_instructor",
    (error, result) => {
      if (!error) {
        res.render("course", { course: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.getCourseInstructor = (req, res) => {
  db.query("SELECT * FROM course_instructor", (error, result) => {
    if (!error) {
      res.render("course_instructor", { course_instructor: result });
    } else {
      res.send(error);
    }
  });
};

exports.addCourseInstructor = (req, res) => {
  let instructor_name = req.body.instructor_name;
  let instructor_info = req.body.instructor_info;
  let instructor_designation = req.body.instructor_designation;

  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO course_instructor (course_instructor_name, course_instructor_info, course_instructor_designation, course_instructor_photo) VALUES(?,?,?,?)",
    [instructor_name, instructor_info, instructor_designation, pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-instructor");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editCourseInstructor = (req, res) => {
  let course_instructor_id = req.params.course_instructor_id;
  console.log("course_instructor_id", course_instructor_id);
  let instructor_name = req.body.instructor_name;
  let instructor_info = req.body.instructor_info;
  let instructor_designation = req.body.instructor_designation;
  console.log(req.body);
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE course_instructor SET course_instructor_name=?, course_instructor_info=?, course_instructor_designation=?, course_instructor_photo=? WHERE course_instructor_id=?",
      [
        instructor_name,
        instructor_info,
        instructor_designation,
        pic_url,
        course_instructor_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-instructor");
        } else {
          console.log(error);
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE course_instructor SET course_instructor_name=?, course_instructor_info=?, course_instructor_designation=? WHERE course_instructor_id=?",
      [
        instructor_name,
        instructor_info,
        instructor_designation,
        course_instructor_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-instructor");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteCourseInstructor = (req, res) => {
  let course_instructor_id = req.params.id;
  db.query(
    "DELETE FROM course_instructor WHERE course_instructor_id=?",
    [course_instructor_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-instructor");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getCourseDetails = (req, res) => {
  let course_id = req.params.id;

  db.query(
    "SELECT * FROM course INNER JOIN course_category ON course_category.course_category_id=course.course_category WHERE course_id=?",
    [course_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM course_benefit WHERE course_id=?",
          [course_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM course_extra_info WHERE course_id=?",
                [course_id],
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "SELECT course_instructor.course_instructor_name,course_instructor.course_instructor_info,course_instructor.course_instructor_designation,course_instructor.course_instructor_photo FROM course INNER JOIN course_instructor ON course_instructor.course_instructor_id=course.course_instructor WHERE course.course_id=?",
                      [course_id],
                      (error3, result3) => {
                        if (!error3) {
                          res.render("course-details", {
                            course_info: result,
                            course_benefit: result1,
                            course_extra_info: result2,
                            course_instructor: result3,
                          });
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
};

exports.getCourseCategory = (req, res) => {
  db.query("SELECT * FROM course_category", (error, result) => {
    if (!error) {
      res.render("course-category", { course_category: result });
    } else {
      res.send(error);
    }
  });
};

exports.addCourseCategory = (req, res) => {
  let category_name = req.body.category_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO course_category (course_category_name,course_category_icon) VALUES(?,?)",
    [category_name, pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editCourseCategory = (req, res) => {
  let course_id = req.params.id;
  let category_name = req.body.category_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE course_category SET course_category_name=?,course_category_icon=? WHERE course_category_id=?",
      [category_name, pic_url, course_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-category");
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE course_category SET course_category_name=? WHERE course_category_id=?",
      [category_name, course_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-category");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteCourseCategory = (req, res) => {
  let course_id = req.params.id;

  db.query(
    "DELETE FROM course_category WHERE course_category_id=?",
    [course_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getCourseEnrollment = async (req, res) => {
  try {
    const query = `
      SELECT * FROM course_enrollment 
      LEFT JOIN course AS join1 ON join1.course_id = course_enrollment.course_id 
      LEFT JOIN user AS join2 ON join2.user_id = course_enrollment.user_id
    `;

    const result = await queryAsync(query);

    // Convert times to Asia/Dhaka timezone
    const converted = result.map((item) => ({
      ...item,
      purchase_time: item.purchase_time
        ? moment
            .utc(item.purchase_time)
            .tz("Asia/Dhaka")
            .format("YYYY-MM-DD HH:mm:ss")
        : null,
      end_time: item.end_time
        ? moment
            .utc(item.end_time)
            .tz("Asia/Dhaka")
            .format("YYYY-MM-DD HH:mm:ss")
        : null,
    }));

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;
    const paginated = converted.slice(startIdx, startIdx + perPage);

    return res.status(200).render("course-enrollment", {
      title: "Course Enrollment",
      course_enrollment: converted,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.getCourseEnrollment = (req, res) => {
//   db.query(
//     "SELECT * FROM course_enrollment LEFT JOIN course as join1 ON 1 LEFT JOIN user as join2 ON 1 WHERE join1.course_id=course_enrollment.course_id AND join2.user_id=course_enrollment.user_id",
//     (error, result) => {
//       if (!error) {
//         res.render("course-enrollment", { course_enrollment: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.changeCourseEnrollmentStatus = (req, res) => {
  let course_enrollment_id = req.params.id;
  let status = req.body.status;

  db.query(
    "UPDATE course_enrollment SET status=? WHERE course_enrollment_id=?",
    [status, course_enrollment_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-enrollment");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getCourseMaterials = (req, res) => {
  let course_id = req.params.id;

  db.query(
    "SELECT * FROM course WHERE course_id=?",
    [course_id],
    (error1, result1) => {
      if (!error1) {
        db.query(
          "SELECT * FROM course_material WHERE course_id=? ORDER BY course_material_serial",
          [course_id],
          (error, result) => {
            if (!error) {
              res.render("course-materials", {
                course_materials: result,
                course: result1,
              });
            } else {
              res.send(error);
            }
          }
        );
      } else {
        res.send(error1);
      }
    }
  );
};

exports.addCourseMaterial = (req, res) => {
  let course_id = req.query.course_id;

  let material_name = req.body.material_name;
  let material_type = req.body.material_type;
  let material_serial = req.body.material_serial;
  let material_status = req.body.material_status;
  let file_url = "";
  const filesrc = req.file ? req.file.filename : "";
  if (filesrc) {
    file_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO course_material (course_id,course_material_name,course_material_type,course_material_url,course_material_serial,course_material_is_free) VALUES(?,?,?,?,?,?)",
    [
      course_id,
      material_name,
      material_type,
      file_url,
      material_serial,
      material_status,
    ],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-materials/" + course_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editCourseMaterial = (req, res) => {
  let course_id = req.query.course_id;
  let course_material_id = req.query.course_material_id;

  let material_name = req.body.material_name;
  let material_type = req.body.material_type;
  let material_serial = req.body.material_serial;
  let material_status = req.body.material_status;
  let file_url = "";
  const filesrc = req.file ? req.file.filename : "";
  if (filesrc) {
    file_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE course_material SET course_material_name=?,course_material_type=?,course_material_url=?,course_material_serial=?,course_material_is_free=? WHERE course_material_id=?",
      [
        material_name,
        material_type,
        file_url,
        material_serial,
        material_status,
        course_material_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-materials/" + course_id);
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE course_material SET course_material_name=?,course_material_type=?,course_material_serial=?,course_material_is_free=? WHERE course_material_id=?",
      [
        material_name,
        material_type,
        material_serial,
        material_status,
        course_material_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/course-materials/" + course_id);
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteCourseMaterial = (req, res) => {
  let course_id = req.query.course_id;
  let course_material_id = req.query.course_material_id;

  db.query(
    "DELETE FROM course_material WHERE course_material_id=?",
    [course_material_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-materials/" + course_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getAddCourse = (req, res) => {
  db.query("SELECT * FROM course_category", (error, result) => {
    if (!error) {
      db.query("SELECT * FROM course_instructor", (error1, result1) => {
        if (!error1) {
          res.render("add-course", {
            course_cat: result,
            course_instructor: result1,
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

exports.addCourse = (req, res) => {
  let course_name = req.body.course_name;
  let course_cat = req.body.course_cat;
  let course_price = req.body.course_price;
  let course_instructor = req.body.course_instructor;
  let course_description = req.body.course_description;
  let course_enrollment = req.body.course_enrollment;
  let course_time = req.body.course_time;
  let course_video = req.body.course_video;
  let course_pdf = req.body.course_pdf;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO course (course_name,course_category,course_instructor,course_price,course_cover_photo) VALUES(?,?,?,?,?)",
    [course_name, course_cat, course_instructor, course_price, pic_url],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM course WHERE course_name=?",
          [course_name],
          (error2, result2) => {
            if (!error2) {
              let course_id = result2[0].course_id;
              db.query(
                "INSERT INTO course_extra_info (course_id,course_short_description,course_total_enrolled,course_time,course_total_video,course_total_pdf) VALUES(?,?,?,?,?,?)",
                [
                  course_id,
                  course_description,
                  course_enrollment,
                  course_time,
                  course_video,
                  course_pdf,
                ],
                (error3, result3) => {
                  if (!error3) {
                    res.redirect("/admin/course");
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
        res.send(error);
      }
    }
  );
};

exports.deleteCourse = (req, res) => {
  let course_id = req.params.id;

  db.query(
    "DELETE FROM course WHERE course_id=?",
    [course_id],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM course_benefit WHERE course_id=?",
          [course_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "DELETE FROM course_extra_info WHERE course_id=?",
                [course_id],
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "DELETE FROM course_material WHERE course_id=?",
                      [course_id],
                      (error3, result3) => {
                        if (!error3) {
                          res.redirect("/admin/course");
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
};

exports.getEditCourse = (req, res) => {
  let course_id = req.params.id;
  db.query("SELECT * FROM course_category", (error, result) => {
    if (!error) {
      db.query("SELECT * FROM course_instructor", (error1, result1) => {
        if (!error1) {
          db.query(
            "SELECT * FROM course INNER JOIN course_category ON course_category.course_category_id=course.course_category WHERE course_id=?",
            [course_id],
            (error3, result3) => {
              if (!error3) {
                db.query(
                  "SELECT * FROM course_extra_info WHERE course_id=?",
                  [course_id],
                  (error2, result2) => {
                    if (!error2) {
                      res.render("edit-course", {
                        course_cat: result,
                        course_instructor: result1,
                        course_info: result3,
                        course_extra_info: result2,
                      });
                    } else {
                      res.send(error2);
                    }
                  }
                );
              } else {
                res.send(error3);
              }
            }
          );
        } else {
          res.send(error1);
        }
      });
    } else {
      res.send(error);
    }
  });
};

exports.editCourse = (req, res) => {
  let course_id = req.params.id;
  let course_name = req.body.course_name;
  let course_cat = req.body.course_cat;
  let course_price = req.body.course_price;
  let course_instructor = req.body.course_instructor;
  let course_description = req.body.course_description;
  let course_enrollment = req.body.course_enrollment;
  let course_time = req.body.course_time;
  let course_video = req.body.course_video;
  let course_pdf = req.body.course_pdf;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
    db.query(
      "UPDATE course SET course_name=?,course_category=?,course_instructor=?,course_price=?,course_cover_photo=? WHERE course_id=?",
      [
        course_name,
        course_cat,
        course_instructor,
        course_price,
        pic_url,
        course_id,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE course_extra_info SET course_short_description=?,course_total_enrolled=?,course_time=?,course_total_video=?,course_total_pdf=? WHERE course_id=?",
            [
              course_description,
              course_enrollment,
              course_time,
              course_video,
              course_pdf,
              course_id,
            ],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/course");
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
      "UPDATE course SET course_name=?,course_category=?,course_instructor=?,course_price=? WHERE course_id=?",
      [course_name, course_cat, course_instructor, course_price, course_id],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE course_extra_info SET course_short_description=?,course_total_enrolled=?,course_time=?,course_total_video=?,course_total_pdf=? WHERE course_id=?",
            [
              course_description,
              course_enrollment,
              course_time,
              course_video,
              course_pdf,
              course_id,
            ],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/course");
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

exports.getCourseBenefits = (req, res) => {
  let course_id = req.params.id;

  db.query(
    "SELECT * FROM course WHERE course_id=?",
    [course_id],
    (error1, result1) => {
      if (!error1) {
        db.query(
          "SELECT * FROM course_benefit WHERE course_id=?",
          [course_id],
          (error, result) => {
            if (!error) {
              res.render("course-benefits", {
                course_benefits: result,
                course: result1,
              });
            } else {
              res.send(error);
            }
          }
        );
      } else {
        res.send(error1);
      }
    }
  );
};

exports.addCourseBenefit = (req, res) => {
  let course_id = req.query.course_id;
  let benefit_name = req.body.benefit_name;

  db.query(
    "INSERT INTO course_benefit(course_id,course_benefit_name) VALUES(?,?)",
    [course_id, benefit_name],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-benefits/" + course_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editCourseBenefit = (req, res) => {
  let course_id = req.query.course_id;
  let course_benefit_id = req.query.course_benefit_id;
  let benefit_name = req.body.benefit_name;

  db.query(
    "UPDATE course_benefit SET course_benefit_name=? WHERE course_benefit_id=?",
    [benefit_name, course_benefit_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-benefits/" + course_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteCourseBenefit = (req, res) => {
  let course_id = req.query.course_id;
  let course_benefit_id = req.query.course_benefit_id;

  db.query(
    "DELETE FROM course_benefit WHERE course_benefit_id=?",
    [course_benefit_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/course-benefits/" + course_id);
      } else {
        res.send(error);
      }
    }
  );
};
