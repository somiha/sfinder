const db = require("../config/database");
const fs = require("fs");
const path = require("path");

function queryAsyncWithoutValue(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// exports.getBuySell = (req, res) => {
//   db.query(
//     "SELECT * FROM user_product INNER JOIN user ON user.user_id=user_product.user_id",
//     (error, result) => {
//       if (!error) {
//         res.render("buy-sell", { user_product: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getBuySell = async (req, res) => {
  const status = req.query.status;
  try {
    let result = [];
    if (status) {
      const query = `
        SELECT * 
        FROM user_product 
        INNER JOIN user ON user.user_id = user_product.user_id
        WHERE user_product.product_status = ?
      `;
      result = await queryAsync(query, [status]);
    } else {
      const query = `
      SELECT * 
      FROM user_product 
      INNER JOIN user ON user.user_id = user_product.user_id
    `;
      result = await queryAsyncWithoutValue(query);
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const startIdx = (page - 1) * perPage;

    const paginated = result.slice(startIdx, startIdx + perPage);

    return res.status(200).render("buy-sell", {
      title: "Buy & Sell",
      user_product: result,
      paginated,
      perPage,
      page,
      status,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.changeUserProductStatus = (req, res) => {
  let user_product_id = req.params.id;
  let status = req.body.status;

  db.query(
    "UPDATE user_product SET product_status=? WHERE user_product_id=?",
    [status, user_product_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/buy-sell");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getUserProductDetails = (req, res) => {
  let user_product_id = req.params.id;

  db.query(
    `SELECT * 
FROM user_product 
LEFT JOIN user AS join1 ON join1.user_id = user_product.user_id 
LEFT JOIN product_cateogry AS join2 ON join2.product_cateogry_id = user_product.product_category 
WHERE user_product.user_product_id = ?`,
    [user_product_id],
    (error, result) => {
      console.log(result);
      if (!error) {
        db.query(
          "SELECT * FROM user_product_image WHERE user_product_id=?",
          [user_product_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM user_product_contact_info WHERE user_product_id=?",
                [user_product_id],
                (error2, result2) => {
                  if (!error2) {
                    res.render("user-product-details", {
                      user_product_details: result,
                      user_product_image: result1,
                      user_product_contact_info: result2,
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
};

exports.filteringUserProduct = (req, res) => {
  let filtering_option = req.body.filtering_option;
  if (filtering_option) {
    return res.redirect("/admin/buy-sell?status=" + filtering_option);
  }

  return res.redirect("/admin/buy-sell");
};

exports.getUserProductCategory = (req, res) => {
  db.query("SELECT * FROM user_product_category", (error, result) => {
    if (!error) {
      res.render("user-product-category", { product_cateogry: result });
    } else {
      res.send(error);
    }
  });
};

exports.addUserProductCategory = (req, res) => {
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "INSERT INTO user_product_category(user_product_category_name) VALUES(?)",
    [product_cat_name],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editUserProductCategory = (req, res) => {
  let product_cat_id = req.params.id;
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "UPDATE user_product_category SET user_product_category_name=? WHERE user_product_category_id=?",
    [product_cat_name, product_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteUserProductCategory = (req, res) => {
  let product_cat_id = req.params.id;

  db.query(
    "DELETE FROM user_product_category WHERE user_product_category_id=?",
    [product_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getUserProductSubCategory = (req, res) => {
  let main_cat_id = req.params.id;

  db.query(
    "SELECT * FROM user_product_sub_category WHERE user_product_main_category=?",
    [main_cat_id],
    (error, result) => {
      if (!error) {
        if (!error) {
          res.render("user-product-sub-cateogry", {
            product_sub_category: result,
            main_cat_id: main_cat_id,
          });
        } else {
          res.send(error);
        }
      } else {
        res.send(error);
      }
    }
  );
};

exports.addUserProductSubCategory = (req, res) => {
  let main_cat_id = req.params.id;
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "INSERT INTO user_product_sub_category(user_product_sub_category_name,user_product_main_category) VALUES(?,?)",
    [product_cat_name, main_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editUserProductSubCategory = (req, res) => {
  let sub_cat_id = req.params.id;
  let main_cat_id = req.body.main_cat_id;
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "UPDATE user_product_sub_category SET user_product_sub_category_name=? WHERE user_product_sub_category_id=?",
    [product_cat_name, sub_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteUserProductSubCategory = (req, res) => {
  let main_cat_id = req.query.main_cat_id;
  let sub_cat_id = req.query.sub_cat_id;

  db.query(
    "DELETE FROM user_product_sub_category WHERE user_product_sub_category_id=?",
    [sub_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/user-product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteBuySell = async (req, res) => {
  let user_product_id = req.params.id;

  const productImages = await queryAsync(
    "SELECT * FROM user_product_image WHERE user_product_id=?",
    [user_product_id]
  );

  db.query(
    "DELETE FROM user_product WHERE user_product_id=?",
    [user_product_id],
    (error, result) => {
      productImages.forEach(async (image) => {
        await queryAsync(
          "DELETE FROM user_product_image WHERE user_product_image_id=?",
          [image.user_product_image_id]
        );

        let imageUrl = image.user_product_image_url;
        let imageName = imageUrl.split("/").pop();

        const filePath = path.join(__dirname, "../public", "upload", imageName);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File deleted successfully");
          }
        });
      });
      if (!error) {
        res.redirect("/admin/buy-sell");
      } else {
        res.send(error);
      }
    }
  );
};

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
