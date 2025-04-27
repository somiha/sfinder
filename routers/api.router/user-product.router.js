const express = require("express");
const userProductRouter = express.Router();
const upload = require("../../config/multer");
let moment = require("moment");
const db = require("../../config/database");

// userProductRouter.post(
//   "/add-user-product",
//   upload.fields([
//     { name: "product_main_image", maxCount: 1 },
//     { name: "product_secondary_image", maxCount: 10 },
//   ]),
//   (req, res) => {
//     let user_id = req.query.user_id;
//     let product_name = req.body.product_name;
//     let product_price = req.body.product_price;
//     let location = req.body.location;
//     let district = req.body.district;
//     let discount = req.body.discount;
//     let product_condition = req.body.product_condition;
//     let product_brand = req.body.product_brand;
//     let product_model = req.body.product_model;
//     let product_category = req.body.product_category;
//     let product_description = req.body.product_description;
//     let is_negotiable = req.body.is_negotiable;
//     let product_upload_date = moment().format("DD-MM-YYYY");
//     let product_status = 0;
//     let product_main_image = "";
//     let product_secondary_image = [];

//     if (req.files) {
//       product_main_image =
//         "https://sfinder.app/upload/" +
//         req.files.product_main_image[0].filename;

//       for (let i = 0; i < req.files.product_secondary_image.length; i++) {
//         product_secondary_image.push(
//           "https://sfinder.app/upload/" +
//             req.files.product_secondary_image[i].filename
//         );
//       }
//     }

//     db.query(
//       "INSERT INTO user_product (user_id,product_name,product_price,location,district,discount,product_condition,product_brand,product_model,product_category,product_description,is_negotiable,product_upload_date,product_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//       [
//         user_id,
//         product_name,
//         product_price,
//         location,
//         district,
//         discount,
//         product_condition,
//         product_brand,
//         product_model,
//         product_category,
//         product_description,
//         is_negotiable,
//         product_upload_date,
//         product_status,
//       ],
//       (error, result) => {
//         if (!error) {
//           db.query(
//             "SELECT * FROM user_product WHERE user_id=?",
//             [user_id],
//             (error1, result1) => {
//               if (!error1) {
//                 let product_id = result1[result1.length - 1].user_product_id;
//                 db.query(
//                   "INSERT INTO user_product_image (user_product_id,user_product_image_url,featured_image) VALUES(?,?,?)",
//                   [product_id, product_main_image, 1],
//                   (error2, result2) => {
//                     if (!error2) {
//                       let imageInsertCount = 0;
//                       for (let i = 0; i < product_secondary_image.length; i++) {
//                         db.query(
//                           "INSERT INTO user_product_image (user_product_id,user_product_image_url,featured_image) VALUES(?,?,?)",
//                           [product_id, product_secondary_image[i], 0],
//                           (error3, result3) => {
//                             if (!error3) {
//                               imageInsertCount++;
//                               if (
//                                 imageInsertCount ===
//                                 product_secondary_image.length
//                               ) {
//                                 db.query(
//                                   "SELECT * FROM user_product WHERE user_product_id=?",
//                                   [product_id],
//                                   (error4, result4) => {
//                                     if (!error4) {
//                                       db.query(
//                                         "SELECT * FROM user_product_image WHERE user_product_id=?",
//                                         [product_id],
//                                         (error5, result5) => {
//                                           if (!error5) {
//                                             res.send({
//                                               status: "success",
//                                               message:
//                                                 "Product added successfully",
//                                               data: {
//                                                 product: result4[0],
//                                                 images: result5,
//                                               },
//                                             });
//                                           } else {
//                                             res.send(error5);
//                                           }
//                                         }
//                                       );
//                                     } else {
//                                       res.send(error4);
//                                     }
//                                   }
//                                 );
//                               }
//                             } else {
//                               res.send(error3);
//                             }
//                           }
//                         );
//                       }
//                       if (product_secondary_image.length === 0) {
//                         res.send({
//                           status: "success",
//                           message: "Product added successfully",
//                         });
//                       }
//                     } else {
//                       res.send(error2);
//                     }
//                   }
//                 );
//               } else {
//                 res.send(error1);
//               }
//             }
//           );
//         } else {
//           res.send(error);
//         }
//       }
//     );
//   }
// );

userProductRouter.post(
  "/add-user-product",
  upload.fields([
    { name: "product_main_image", maxCount: 1 },
    { name: "product_secondary_image", maxCount: 10 },
  ]),
  (req, res) => {
    let user_id = req.query.user_id;
    let product_name = req.body.product_name;
    let product_price = req.body.product_price;
    let location = req.body.location;
    let district = req.body.district;
    let discount = req.body.discount;
    let product_condition = req.body.product_condition;
    let product_brand = req.body.product_brand;
    let product_model = req.body.product_model;
    let product_category = req.body.product_category;
    let product_description = req.body.product_description;
    let is_negotiable = req.body.is_negotiable;
    let product_upload_date = moment().format("DD-MM-YYYY");
    let product_status = 0;
    let product_main_image = "";
    let product_secondary_image = [];

    // Check for uploaded files
    if (req.files && req.files.product_main_image) {
      product_main_image =
        "https://sfinder.app/upload/" +
        req.files.product_main_image[0].filename;
    }

    if (req.files && req.files.product_secondary_image) {
      for (let i = 0; i < req.files.product_secondary_image.length; i++) {
        product_secondary_image.push(
          "https://sfinder.app/upload/" +
            req.files.product_secondary_image[i].filename
        );
      }
    }

    db.query(
      "INSERT INTO user_product (user_id,product_name,product_price,location,district,discount,product_condition,product_brand,product_model,product_category,product_description,is_negotiable,product_upload_date,product_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        user_id,
        product_name,
        product_price,
        location,
        district,
        discount,
        product_condition,
        product_brand,
        product_model,
        product_category,
        product_description,
        is_negotiable,
        product_upload_date,
        product_status,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "SELECT * FROM user_product WHERE user_id=?",
            [user_id],
            (error1, result1) => {
              if (!error1) {
                let product_id = result1[result1.length - 1].user_product_id;

                // Insert main image if it exists
                if (product_main_image) {
                  db.query(
                    "INSERT INTO user_product_image (user_product_id,user_product_image_url,featured_image) VALUES(?,?,?)",
                    [product_id, product_main_image, 1],
                    (error2, result2) => {
                      if (error2) return res.send(error2);
                    }
                  );
                }

                // Insert secondary images if they exist
                if (product_secondary_image.length > 0) {
                  let imageInsertCount = 0;

                  for (let i = 0; i < product_secondary_image.length; i++) {
                    db.query(
                      "INSERT INTO user_product_image (user_product_id,user_product_image_url,featured_image) VALUES(?,?,?)",
                      [product_id, product_secondary_image[i], 0],
                      (error3, result3) => {
                        if (error3) return res.send(error3);

                        imageInsertCount++;
                        if (
                          imageInsertCount === product_secondary_image.length
                        ) {
                          fetchProductData(product_id, res);
                        }
                      }
                    );
                  }
                } else {
                  // If no secondary images, fetch product data directly
                  fetchProductData(product_id, res);
                }
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
);

// Helper function to fetch product data
function fetchProductData(product_id, res) {
  db.query(
    "SELECT * FROM user_product WHERE user_product_id=?",
    [product_id],
    (error4, result4) => {
      if (!error4) {
        db.query(
          "SELECT * FROM user_product_image WHERE user_product_id=?",
          [product_id],
          (error5, result5) => {
            if (!error5) {
              res.send({
                status: "success",
                message: "Product added successfully",
                data: {
                  product: result4[0],
                  images: result5,
                },
              });
            } else {
              res.send(error5);
            }
          }
        );
      } else {
        res.send(error4);
      }
    }
  );
}

userProductRouter.post(
  "/add-product-contact-info",
  upload.none(),
  (req, res) => {
    let product_id = req.query.product_id;
    let name = req.body.name;
    let email = req.body.email;
    let contact_no = req.body.contact_no;

    db.query(
      "INSERT INTO user_product_contact_info (user_product_id,name,email,contact_no) VALUES(?,?,?,?)",
      [product_id, name, email, contact_no],
      (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Add user product contact info successfully",
            data: [],
          });
        } else {
          res.send(error);
        }
      }
    );
  }
);

// userProductRouter.get("/user-products", (req, res) => {
//   db.query(
//     "SELECT * FROM user_product LEFT JOIN user_product_image as join1 ON 1 LEFT JOIN user_product_sub_category as join2 ON 1 LEFT JOIN division as join3 ON 1 WHERE join1.user_product_id=user_product.user_product_id AND join2.user_product_sub_category_id=user_product.product_category AND join3.division_id=user_product.location AND join1.featured_image=? AND user_product.product_status=1",
//     [1],
//     (error, result) => {
//       if (!error) {
//         res.send({
//           status: "success",
//           message: "Get user products successfully",
//           data: result,
//         });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

userProductRouter.get("/user-products", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 35; // Items per page
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE join1.featured_image = ? AND user_product.product_status = 1
  `;

  const dataQuery = `
    SELECT * 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE join1.featured_image = ? AND user_product.product_status = 1
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, [1], (error, countResult) => {
    if (!error) {
      const totalPages = Math.ceil(countResult[0].total / limit);
      db.query(dataQuery, [1, limit, offset], (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Get user products successfully",
            page,
            limit,
            totalPages,
            data: result,
          });
        } else {
          res.send(error);
        }
      });
    } else {
      res.send(error);
    }
  });
});

userProductRouter.get("/user-products-by-cateogry", (req, res) => {
  let category_id = req.query.category_id;
  db.query(
    "SELECT * FROM user_product LEFT JOIN user_product_image as join1 ON 1 LEFT JOIN user_product_sub_category as join2 ON 1 LEFT JOIN division as join3 ON 1 WHERE join1.user_product_id=user_product.user_product_id AND join2.user_product_sub_category_id=user_product.product_category AND join3.division_id=user_product.location AND user_product.product_category=?  AND join1.featured_image=?",
    [category_id, 1],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user products by category successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

userProductRouter.get("/user-product-details", (req, res) => {
  let product_id = req.query.product_id;
  let user_id = req.query.user_id;
  let seller_id = req.query.seller_id;
  db.query(
    "SELECT * FROM user_product LEFT JOIN user_product_sub_category as join2 ON 1 LEFT JOIN division as join3 ON 1 LEFT JOIN district as join4 ON 1 WHERE join2.user_product_sub_category_id=user_product.product_category AND join3.division_id=user_product.location AND join4.district_id=user_product.district AND user_product.user_product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM user_product_image WHERE user_product_id=?",
          [product_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM user_product_contact_info WHERE user_product_id=?",
                [product_id],
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "SELECT * FROM bid WHERE user_id=? AND seller_id=? AND product_id=?",
                      [user_id, seller_id, product_id],
                      (error3, result3) => {
                        if (!error3) {
                          let bid_id;
                          if (result3.length > 0) {
                            bid_id = result3[0].bid_id;
                          } else {
                            bid_id = null;
                          }
                          res.send({
                            status: "success",
                            message: "Get user product details successfully",
                            product_info: result,
                            product_image: result1,
                            product_contact_info: result2,
                            bid_id: bid_id,
                            data: [],
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
});

// userProductRouter.get("/product-by-seller", (req, res) => {
//   let seller_id = req.query.seller_id;
//   db.query(
//     "SELECT * FROM user_product LEFT JOIN user_product_image as join1 ON 1 LEFT JOIN user_product_sub_category as join2 ON 1 LEFT JOIN division as join3 ON 1 WHERE join1.user_product_id=user_product.user_product_id AND join2.user_product_sub_category_id=user_product.product_category AND join3.division_id=user_product.location AND user_product.user_id=? AND join1.featured_image=?",
//     [seller_id, 1],
//     (error, result) => {
//       if (!error) {
//         res.send({
//           status: "success",
//           message: "Get user products by seller successfully",
//           data: result,
//         });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

// userProductRouter.get("/product-by-seller", (req, res) => {
//   let seller_id = req.query.seller_id;
//   db.query(
//     `SELECT *
// FROM user_product
// LEFT JOIN user_product_image AS join1
//     ON join1.user_product_id = user_product.user_product_id AND join1.featured_image = 1
// LEFT JOIN user_product_sub_category AS join2
//     ON join2.user_product_sub_category_id = user_product.product_category
// LEFT JOIN division AS join3
//     ON join3.division_id = user_product.location
// WHERE user_product.user_id = ? AND join1.featured_image = ?;`,
//     [seller_id, 1],
//     (error, result) => {
//       if (!error) {
//         res.send({
//           status: "success",
//           message: "Get user products by seller successfully",
//           data: result,
//         });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

userProductRouter.get("/product-by-seller", (req, res) => {
  let seller_id = req.query.seller_id;
  db.query(
    ` SELECT * 
  FROM user_product 
  LEFT JOIN user_product_image AS join1 
      ON join1.user_product_id = user_product.user_product_id 
         AND join1.featured_image = 1
  LEFT JOIN user_product_sub_category AS join2 
      ON join2.user_product_sub_category_id = user_product.product_category
  LEFT JOIN division AS join3 
      ON join3.division_id = user_product.location
  WHERE user_product.user_id = ?


`,
    [seller_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user products by seller successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

userProductRouter.post(
  "/add-chat",
  upload.single("message_file"),
  (req, res) => {
    let user_id = req.query.user_id;
    let seller_id = req.query.seller_id;
    let product_id = req.query.product_id;
    let message = req.body.message;
    let is_user = req.body.is_user;
    let message_date = moment().utcOffset("GMT+06:00").format("DD-MM-YYYY");
    let message_time = moment().utcOffset("GMT+06:00").format("LT");
    let file_type = req.body.file_type;
    let pic_url = "";
    const imgsrc = req.file ? req.file.filename : "";
    if (imgsrc) {
      pic_url = "https://sfinder.app/upload/" + req.file.filename;
      db.query(
        "SELECT * FROM bid WHERE user_id=? AND seller_id=? AND product_id=?",
        [user_id, seller_id, product_id],
        (error3, result3) => {
          if (!error3) {
            if (result3.length > 0) {
              let bid_id = result3[0].bid_id;
              db.query(
                "INSERT INTO user_chat (user_id,seller_id,product_id,bid_id,file_url,file_type,is_user,date,time) VALUES(?,?,?,?,?,?,?,?,?)",
                [
                  user_id,
                  seller_id,
                  product_id,
                  bid_id,
                  pic_url,
                  file_type,
                  is_user,
                  message_date,
                  message_time,
                ],
                (error, result) => {
                  if (!error) {
                    db.query(
                      "SELECT * FROM user_chat WHERE bid_id=?",
                      [bid_id],
                      (error1, result1) => {
                        if (!error1) {
                          res.send({
                            status: "success",
                            message: "Add message successfully",
                            data: result1,
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
            } else {
              db.query(
                "INSERT INTO bid (user_id,seller_id,product_id) VALUES(?,?,?)",
                [user_id, seller_id, product_id],
                (error1, result1) => {
                  if (!error1) {
                    db.query(
                      "SELECT * FROM bid WHERE user_id=? AND seller_id=? AND product_id=?",
                      [user_id, seller_id, product_id],
                      (error2, result2) => {
                        if (!error2) {
                          let bid_id = result2[0].bid_id;
                          db.query(
                            "INSERT INTO user_chat (user_id,seller_id,product_id,bid_id,file_url,is_user,date,time) VALUES(?,?,?,?,?,?,?,?)",
                            [
                              user_id,
                              seller_id,
                              product_id,
                              bid_id,
                              pic_url,
                              is_user,
                              message_date,
                              message_time,
                            ],
                            (error, result) => {
                              if (!error) {
                                db.query(
                                  "SELECT * FROM user_chat WHERE bid_id=?",
                                  [bid_id],
                                  (error3, result3) => {
                                    if (!error3) {
                                      res.send({
                                        status: "success",
                                        message: "Add message successfully",
                                        data: result3,
                                      });
                                    } else {
                                      res.send(error3);
                                    }
                                  }
                                );
                              } else {
                                res.send(error);
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
            }
          } else {
            res.send(error3);
          }
        }
      );
    } else {
      db.query(
        "SELECT * FROM bid WHERE user_id=? AND seller_id=? AND product_id=?",
        [user_id, seller_id, product_id],
        (error3, result3) => {
          if (!error3) {
            if (result3.length > 0) {
              let bid_id = result3[0].bid_id;
              db.query(
                "INSERT INTO user_chat (user_id,seller_id,product_id,bid_id,message,is_user,date,time) VALUES(?,?,?,?,?,?,?,?)",
                [
                  user_id,
                  seller_id,
                  product_id,
                  bid_id,
                  message,
                  is_user,
                  message_date,
                  message_time,
                ],
                (error, result) => {
                  if (!error) {
                    db.query(
                      "SELECT * FROM user_chat WHERE bid_id=?",
                      [bid_id],
                      (error1, result1) => {
                        if (!error1) {
                          res.send({
                            status: "success",
                            message: "Add message successfully",
                            data: result1,
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
            } else {
              db.query(
                "INSERT INTO bid (user_id,seller_id,product_id) VALUES(?,?,?)",
                [user_id, seller_id, product_id],
                (error1, result1) => {
                  if (!error1) {
                    db.query(
                      "SELECT * FROM bid WHERE user_id=? AND seller_id=? AND product_id=?",
                      [user_id, seller_id, product_id],
                      (error2, result2) => {
                        if (!error2) {
                          let bid_id = result2[0].bid_id;
                          db.query(
                            "INSERT INTO user_chat (user_id,seller_id,product_id,bid_id,message,is_user,date,time) VALUES(?,?,?,?,?,?,?,?)",
                            [
                              user_id,
                              seller_id,
                              product_id,
                              bid_id,
                              message,
                              is_user,
                              message_date,
                              message_time,
                            ],
                            (error, result) => {
                              if (!error) {
                                db.query(
                                  "SELECT * FROM user_chat WHERE bid_id=?",
                                  [bid_id],
                                  (error3, result3) => {
                                    if (!error3) {
                                      res.send({
                                        status: "success",
                                        message: "Add message successfully",
                                        data: result3,
                                      });
                                    } else {
                                      res.send(error3);
                                    }
                                  }
                                );
                              } else {
                                res.send(error);
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
            }
          } else {
            res.send(error3);
          }
        }
      );
    }
  }
);

userProductRouter.get("/get-chat", (req, res) => {
  let bid_id = req.query.bid_id;
  db.query(
    "SELECT * FROM user_chat WHERE bid_id=?",
    [bid_id],
    (error, result) => {
      if (!error) {
        let user_id = result[0].user_id;
        let seller_id = result[0].seller_id;
        let product_id = result[0].product_id;
        db.query(
          "SELECT * FROM user WHERE user_id=?",
          [user_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM user WHERE user_id=?",
                [seller_id],
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "SELECT * FROM user_product INNER JOIN user_product_image ON user_product_image.user_product_id=user_product.user_product_id WHERE user_product.user_product_id=? AND user_product_image.featured_image=?",
                      [product_id, 1],
                      (error3, result3) => {
                        if (!error3) {
                          res.send({
                            status: "success",
                            message: "Get message successfully",
                            user_info: result1,
                            seller_info: result2,
                            product_info: result3,
                            data: result,
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
});

userProductRouter.get("/seller-chat", (req, res) => {
  let user_id = req.query.user_id;

  db.query(
    "SELECT * FROM user_chat INNER JOIN user ON user.user_id=user_chat.seller_id WHERE user_chat.user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        const uniqueSellerData = [];
        const sellerIds = new Set();

        for (const row of result) {
          if (!sellerIds.has(row.seller_id)) {
            uniqueSellerData.push(row);
            sellerIds.add(row.seller_id);
          }
        }
        res.send({
          status: "success",
          message: "Get seller chat successfully",
          data: uniqueSellerData,
        });
      } else {
        res.send(error);
      }
    }
  );
});

userProductRouter.get("/user-chat", (req, res) => {
  let seller_id = req.query.seller_id;
  db.query(
    "SELECT * FROM user_chat INNER JOIN user ON user.user_id=user_chat.user_id WHERE user_chat.seller_id=?",
    [seller_id],
    (error, result) => {
      if (!error) {
        const uniqueUserData = [];
        const userIds = new Set();

        for (const row of result) {
          if (!userIds.has(row.user_id)) {
            uniqueUserData.push(row);
            userIds.add(row.user_id);
          }
        }
        res.send({
          status: "success",
          message: "Get user chat successfully",
          data: uniqueUserData,
        });
      } else {
        res.send(error);
      }
    }
  );
});

const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

userProductRouter.post(
  "/edit-user-product",
  upload.fields([
    { name: "product_main_image", maxCount: 1 },
    { name: "product_secondary_image", maxCount: 10 },
  ]),
  async (req, res) => {
    let product_id = req.query.product_id;
    let product_name = req.body.product_name;
    let product_price = req.body.product_price;
    let location = req.body.location;
    let district = req.body.district;
    let discount = req.body.discount;
    let product_condition = req.body.product_condition;
    let product_brand = req.body.product_brand;
    let product_model = req.body.product_model;
    let product_category = req.body.product_category;
    let product_description = req.body.product_description;
    let is_negotiable = req.body.is_negotiable;
    let product_status = 0;
    let product_main_image = "";
    let product_secondary_image = [];
    let name = req.body.name;
    let email = req.body.email;
    let contact_no = req.body.contact_no;

    if (req.files.product_main_image) {
      product_main_image =
        "https://sfinder.app/upload/" +
        req.files.product_main_image[0].filename;
      for (let i = 0; i < req.files.product_secondary_image.length; i++) {
        product_secondary_image.push(
          "https://sfinder.app/upload/" +
            req.files.product_secondary_image[i].filename
        );
      }
    }

    try {
      await queryPromise(
        "UPDATE user_product SET product_name=?,product_price=?,location=?, district=?,discount=?,product_condition=?,product_brand=?,product_model=?,product_category=?,product_description=?,is_negotiable=?,product_status=? WHERE user_product_id=?",
        [
          product_name,
          product_price,
          location,
          district,
          discount,
          product_condition,
          product_brand,
          product_model,
          product_category,
          product_description,
          is_negotiable,
          product_status,
          product_id,
        ]
      );

      if (product_main_image) {
        await queryPromise(
          "UPDATE user_product_image SET user_product_image_url=? WHERE user_product_id=? AND featured_image=?",
          [product_main_image, product_id, 1]
        );

        await queryPromise(
          "Delete FROM user_product_image WHERE user_product_id=? AND featured_image=?",
          [product_id, 0]
        );

        for (let i = 0; i < product_secondary_image.length; i++) {
          await queryPromise(
            "INSERT INTO user_product_image (user_product_id, user_product_image_url, featured_image) VALUES (?, ?, ?)",
            [product_id, product_secondary_image[i], 0]
          );
        }
        console.log(product_secondary_image);
      }

      // await queryPromise(
      //   "UPDATE user_product_contact_info SET name=?,email=?,contact_no=? WHERE user_product_id=?",
      //   [name, email, contact_no, product_id]
      // );

      const contactInfo = await queryPromise(
        "SELECT * FROM user_product_contact_info WHERE user_product_id=?",
        [product_id]
      );

      if (contactInfo.length === 0) {
        await queryPromise(
          "INSERT INTO user_product_contact_info (user_product_id, name, email, contact_no) VALUES (?, ?, ?, ?)",
          [product_id, name, email, contact_no]
        );
      } else {
        await queryPromise(
          "UPDATE user_product_contact_info SET name=?,email=?,contact_no=? WHERE user_product_id=?",
          [name, email, contact_no, product_id]
        );
      }

      const productDetails = await queryPromise(
        "SELECT * FROM user_product WHERE user_product_id=?",
        [product_id]
      );

      const productImages = await queryPromise(
        "SELECT * FROM user_product_image WHERE user_product_id=?",
        [product_id]
      );

      res.send({
        status: "success",
        message: "Edit user product successfully",
        data: {
          productDetails,
          productImages,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
);

userProductRouter.get("/user-product-category", (req, res) => {
  db.query("SELECT * FROM user_product_category", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get user product main category successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

userProductRouter.get("/user-product-sub-category", (req, res) => {
  let main_cat_id = req.query.main_cat_id;

  db.query(
    "SELECT * FROM user_product_sub_category WHERE user_product_main_category=?",
    [main_cat_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user product sub category successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

userProductRouter.get("/user-products-by-location", (req, res) => {
  let division = req.query.division;

  db.query(
    "SELECT * FROM user_product LEFT JOIN user_product_image as join1 ON 1 LEFT JOIN user_product_sub_category as join2 ON 1 LEFT JOIN division as join3 ON 1 WHERE join1.user_product_id=user_product.user_product_id AND join2.user_product_sub_category_id=user_product.product_category AND join3.division_id=user_product.location AND join1.featured_image=? AND user_product.location=?",
    [1, division],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user products by location successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

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

userProductRouter.get("/delete-user-product/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await queryAsync(
      "SELECT * FROM user_product WHERE user_product_id = ?",
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    await queryAsync("DELETE FROM user_product WHERE user_product_id = ?", [
      product_id,
    ]);

    await queryAsync(
      "DELETE FROM user_product_image WHERE user_product_id = ?",
      [product_id]
    );

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = userProductRouter;
