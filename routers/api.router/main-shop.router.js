const express = require("express");
const mainShopRouter = express.Router();
const upload = require("../../config/multer");
let moment = require("moment");
const db = require("../../config/database");

mainShopRouter.get("/product-category", (req, res) => {
  db.query("SELECT * FROM product_cateogry", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get product main category successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

mainShopRouter.get("/product-sub-category", (req, res) => {
  let main_cat_id = req.query.main_cat_id;

  db.query(
    "SELECT * FROM product_sub_cateogry WHERE product_main_category=?",
    [main_cat_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get product sub category successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

// mainShopRouter.get("/main-products", (req, res) => {
//   db.query(
//     "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON main_product.product_category=product_sub_cateogry.product_sub_cateogry_id",
//     (error, result) => {
//       if (!error) {
//         res.send({
//           status: "success",
//           message: "Get main products successfully",
//           data: result,
//         });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// });

mainShopRouter.get("/main-products", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 35; // Items per page
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM main_product 
    INNER JOIN product_sub_cateogry 
    ON main_product.product_category = product_sub_cateogry.product_sub_cateogry_id
  `;

  const dataQuery = `
    SELECT * 
    FROM main_product 
    INNER JOIN product_sub_cateogry 
    ON main_product.product_category = product_sub_cateogry.product_sub_cateogry_id
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (error, countResult) => {
    if (!error) {
      const totalPages = Math.ceil(countResult[0].total / limit);
      db.query(dataQuery, [limit, offset], (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Get main products successfully",
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

mainShopRouter.get("/main-products-by-category", (req, res) => {
  let category_id = req.query.category_id;
  db.query(
    "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON main_product.product_category=product_sub_cateogry.product_sub_cateogry_id WHERE main_product.product_category=?",
    [category_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get main products by category successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

mainShopRouter.get("/main-product-details", (req, res) => {
  let product_id = req.query.product_id;
  db.query(
    "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON main_product.product_category=product_sub_cateogry.product_sub_cateogry_id WHERE main_product.main_product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM main_product_image WHERE main_product_id=?",
          [product_id],
          (error1, result1) => {
            if (!error1) {
              res.send({
                status: "success",
                message: "Get main product details successfully",
                product_info: result,
                product_exta_image: result1,
                data: [],
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
});

mainShopRouter.post("/add-to-cart", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let product_id = req.body.product_id;
  let product_price = req.body.product_price;

  db.query(
    "SELECT * FROM cart WHERE user_id=? AND product_id=?",
    [user_id, product_id],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          res.send({
            status: "failed",
            message: "Already this product is on cart",
            data: [],
          });
        } else {
          db.query(
            "INSERT INTO cart (user_id,product_id,product_price) VALUES(?,?,?)",
            [user_id, product_id, product_price],
            (error1, result1) => {
              if (!error1) {
                res.send({
                  status: "success",
                  message: "Product add to cart successfully",
                  data: [],
                });
              } else {
                res.send(error1);
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

mainShopRouter.get("/user-cart", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM cart INNER JOIN main_product ON cart.product_id=main_product.main_product_id WHERE user_id=?",
    [user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user cart successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

mainShopRouter.get("/delete-product-cart", upload.none(), (req, res) => {
  let cart_id = req.query.cart_id;
  db.query("DELETE FROM cart WHERE cart_id=?", [cart_id], (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Delete product from cart successfully",
        data: [],
      });
    } else {
      res.send(error);
    }
  });
});

mainShopRouter.post("/add-direct-product-order", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let order_price = req.body.order_price;
  let name = req.body.name;
  let mobile_number = req.body.mobile_number;
  let order_address = req.body.order_address;
  let note = req.body.note;
  let payment_by = "Cash On Delivery";
  let order_status = "Pending";
  let order_details = req.body.order_details;
  let order_date = moment().format("DD-MM-YYYY");
  const final_order_details = JSON.parse(order_details);

  db.query(
    "INSERT INTO all_order (user_id,order_price,name,mobile_number,address,payment_by,order_status,order_date) VALUES(?,?,?,?,?,?,?,?)",
    [
      user_id,
      order_price,
      name,
      mobile_number,
      order_address,
      payment_by,
      order_status,
      order_date,
    ],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM cart WHERE user_id=?",
          [user_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM all_order WHERE user_id=?",
                [user_id],
                (error2, result2) => {
                  if (!error2) {
                    let order_id = result2[result2.length - 1].order_id;
                    for (let i = 0; i < final_order_details.length; i++) {
                      db.query(
                        "INSERT INTO order_details(order_id,product_id,product_quantity,product_total_price) VALUES(?,?,?,?)",
                        [
                          order_id,
                          final_order_details[i].product_id,
                          final_order_details[i].product_quantity,
                          final_order_details[i].product_total_price,
                        ],
                        (error3, result3) => {
                          if (!error3) {
                          } else {
                            res.send(error3);
                          }
                        }
                      );
                    }
                    const final_note = JSON.parse(note);
                    // console.log("note", note);
                    // console.log("order-details", order_details);
                    for (let j = 0; j < final_note.length; j++) {
                      db.query(
                        "INSERT INTO order_user_note (user_id,order_id,title,description) VALUES(?,?,?,?)",
                        [
                          user_id,
                          order_id,
                          final_note[j].title,
                          final_note[j].description,
                        ],
                        (error4, result4) => {
                          if (!error4) {
                          } else {
                            res.send(error4);
                          }
                        }
                      );
                    }

                    res.send({
                      status: "success",
                      message: "Add order successfully",
                      data: [],
                    });
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

mainShopRouter.post("/add-order", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let order_price = req.body.order_price;
  let name = req.body.name;
  let mobile_number = req.body.mobile_number;
  let order_address = req.body.order_address;
  let note = req.body.note;
  let payment_by = "Cash On Delivery";
  let order_status = "Pending";
  let order_details = req.body.order_details;
  let order_date = moment().format("DD-MM-YYYY");
  const final_order_details = JSON.parse(order_details);

  db.query(
    "INSERT INTO all_order (user_id,order_price,name,mobile_number,address,payment_by,order_status,order_date) VALUES(?,?,?,?,?,?,?,?)",
    [
      user_id,
      order_price,
      name,
      mobile_number,
      order_address,
      payment_by,
      order_status,
      order_date,
    ],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM cart WHERE user_id=?",
          [user_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM all_order WHERE user_id=?",
                [user_id],
                (error2, result2) => {
                  if (!error2) {
                    let order_id = result2[result2.length - 1].order_id;
                    for (let i = 0; i < final_order_details.length; i++) {
                      db.query(
                        "INSERT INTO order_details(order_id,product_id,product_quantity,product_total_price) VALUES(?,?,?,?)",
                        [
                          order_id,
                          final_order_details[i].product_id,
                          final_order_details[i].product_quantity,
                          final_order_details[i].product_total_price,
                        ],
                        (error3, result3) => {
                          if (!error3) {
                          } else {
                            res.send(error3);
                          }
                        }
                      );
                    }
                    res.send({
                      status: "success",
                      message: "Add order successfully",
                      data: [],
                    });
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

mainShopRouter.post("/edit-order-note", upload.none(), (req, res) => {
  let user_id = req.query.user_id;
  let order_id = req.query.order_id;
  let note = req.body.note;

  const final_note = JSON.parse(note);

  db.query(
    "DELETE FROM order_user_note WHERE order_id=?",
    [order_id],
    (error, result) => {
      if (!error) {
        for (let j = 0; j < final_note.length; j++) {
          db.query(
            "INSERT INTO order_user_note (user_id,order_id,title,description) VALUES(?,?,?,?)",
            [user_id, order_id, final_note[j].title, final_note[j].description],
            (error4, result4) => {
              if (!error4) {
              } else {
                res.send(error4);
              }
            }
          );
        }
        res.send({
          status: "success",
          message: "Update order note successfully",
          data: [],
        });
      } else {
        res.send(error);
      }
    }
  );
});

mainShopRouter.get("/user-orders", (req, res) => {
  let user_id = req.query.user_id;
  db.query(
    "SELECT * FROM all_order WHERE user_id=? ORDER BY order_id DESC",
    [user_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get user orders successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

mainShopRouter.get("/order-details", (req, res) => {
  let order_id = req.query.order_id;
  db.query(
    "SELECT * FROM order_details INNER JOIN main_product ON main_product.main_product_id=order_details.product_id WHERE order_details.order_id=?",
    [order_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM order_user_note WHERE order_id=?",
          [order_id],
          (error1, result1) => {
            if (!error1) {
              res.send({
                status: "success",
                message: "Get order details successfully",
                data: result,
                order_user_note: result1,
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
});

mainShopRouter.get("/direct-product-title", (req, res) => {
  let product_id = req.query.product_id;
  db.query(
    "SELECT title FROM direct_order_product WHERE product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get direct product title successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

module.exports = mainShopRouter;
