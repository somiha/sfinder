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

exports.getShop = async (req, res) => {
  try {
    const { search_shop_cat, product_name } = req.query;
    let query;
    let result;
    if (search_shop_cat) {
      query = `
        SELECT * FROM main_product 
        INNER JOIN product_sub_cateogry 
        ON product_sub_cateogry.product_sub_cateogry_id = main_product.product_category
        WHERE product_sub_cateogry.product_sub_cateogry_name LIKE ?
      `;
      const searchKeyword = `%${search_shop_cat}%`; // Ensure '%' is included before passing the value
      result = await queryAsync(query, [searchKeyword]);
    } else if (product_name) {
      query = `
        SELECT * FROM main_product 
        INNER JOIN product_sub_cateogry 
        ON product_sub_cateogry.product_sub_cateogry_id = main_product.product_category
        WHERE main_product.product_name LIKE ?
      `;
      const searchKeyword = `%${product_name}%`; // Ensure '%' is included before passing the value
      result = await queryAsync(query, [searchKeyword]);
    } else {
      query = `
       SELECT * FROM main_product INNER JOIN product_sub_cateogry ON product_sub_cateogry.product_sub_cateogry_id=main_product.product_category
      `;
      result = await queryAsyncWithoutValue(query);
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;

    const paginated = result.slice(startIdx, startIdx + perPage);

    return res.status(200).render("shop", {
      title: "Buy & Sell",
      main_product: result,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getShopsByCategorySearch = async (req, res) => {
  try {
    const { search_shop_cat, product_name } = req.body;
    console.log(search_shop_cat, product_name);
    if (search_shop_cat) {
      return res.redirect("/admin/shop?search_shop_cat=" + search_shop_cat);
    } else if (product_name) {
      return res.redirect("/admin/shop?product_name=" + product_name);
    } else {
      return res.redirect("/admin/shop");
    }
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
// exports.getShop = (req, res) => {
//   db.query(
//     "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON product_sub_cateogry.product_sub_cateogry_id=main_product.product_category",
//     (error, result) => {
//       if (!error) {
//         res.render("shop", { main_product: result });
//       } else {
//         res.send(error);
//       }
//     }
//   );
// };

exports.getShopProductDetails = (req, res) => {
  let product_id = req.params.id;

  db.query(
    "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON product_sub_cateogry.product_sub_cateogry_id=main_product.product_category WHERE main_product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM main_product_image WHERE main_product_id=?",
          [product_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM direct_order_product WHERE product_id=?",
                [product_id],
                (error2, result2) => {
                  if (!error2) {
                    res.render("shop-product-details", {
                      product_details: result,
                      product_image: result1,
                      direct_order_product: result2,
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

exports.getProductCategory = (req, res) => {
  db.query("SELECT * FROM product_cateogry", (error, result) => {
    if (!error) {
      res.render("product-category", { product_cateogry: result });
    } else {
      res.send(error);
    }
  });
};

exports.addProductCategory = (req, res) => {
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "INSERT INTO product_cateogry (category_name) VALUES (?)",
    [product_cat_name],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editProductCategory = (req, res) => {
  let product_cat_id = req.params.id;
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "UPDATE product_cateogry SET category_name=? WHERE product_cateogry_id=?",
    [product_cat_name, product_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteProductCategory = (req, res) => {
  let product_cat_id = req.params.id;

  db.query(
    "DELETE FROM product_cateogry WHERE product_cateogry_id=?",
    [product_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-category");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getAddProduct = (req, res) => {
  db.query("SELECT * FROM product_sub_cateogry", (error, result) => {
    if (!error) {
      res.render("add-product", { product_cat: result });
    } else {
      res.send(error);
    }
  });
};

exports.addProduct = (req, res) => {
  let product_name = req.body.product_name;
  let product_cat = req.body.product_cat;
  let product_price = req.body.product_price;
  let product_discount = req.body.product_discount;
  let product_qunatity = req.body.product_qunatity;
  let direct_order = req.body.direct_order;
  let product_description = req.body.product_description;
  let product_main_image = "";
  let product_secondary_image = "";
  if (req.files) {
    product_main_image =
      "https://sfinder.app/upload/" +
      req.files.product_featured_image[0].filename;
    // product_secondary_image =
    //   "https://sfinder.app/upload/" +
    //   req.files.product_secondary_image[0].filename;
  }

  db.query(
    "INSERT INTO main_product (product_name,product_price,product_category,product_discount,product_image_url,product_quantity,direct_order,product_description) VALUES(?,?,?,?,?,?,?,?)",
    [
      product_name,
      product_price,
      product_cat,
      product_discount,
      product_main_image,
      product_qunatity,
      direct_order,
      product_description,
    ],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop");
        // db.query("SELECT * FROM main_product", (error1, result1) => {
        //   if (!error1) {
        //     let product_id = result1[result1.length - 1].main_product_id;
        //     db.query(
        //       "INSERT INTO main_product_image (main_product_id,main_product_image_url) VALUES(?,?)",
        //       [product_id, product_secondary_image],
        //       (error2, result2) => {
        //         if (!error2) {
        //           res.redirect("/admin/shop");
        //         } else {
        //           res.send(error2);
        //         }
        //       }
        //     );
        //   } else {
        //     res.send(error1);
        //   }
        // });
      } else {
        res.send(error);
      }
    }
  );
};

exports.getEditProduct = (req, res) => {
  let product_id = req.params.id;
  db.query(
    "SELECT * FROM main_product INNER JOIN product_sub_cateogry ON product_sub_cateogry.product_sub_cateogry_id=main_product.product_category WHERE main_product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM main_product_image WHERE main_product_id=?",
          [product_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM product_sub_cateogry",
                (error2, result2) => {
                  if (!error2) {
                    db.query(
                      "SELECT * FROM direct_order_product WHERE product_id=?",
                      [product_id],
                      (error3, result3) => {
                        if (!error3) {
                          res.render("edit-product", {
                            product_details: result,
                            product_image: result1,
                            product_cat: result2,
                            direct_product_title: result3,
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

exports.editProduct = (req, res) => {
  let product_id = req.params.id;
  let product_name = req.body.product_name;
  let product_cat = req.body.product_cat;
  let product_price = req.body.product_price;
  let product_discount = req.body.product_discount;
  let product_qunatity = req.body.product_qunatity;
  let product_description = req.body.product_description;
  let product_main_image = "";
  let product_secondary_image = "";

  if (req.files.product_featured_image) {
    product_main_image =
      "https://sfinder.app/upload/" +
      req.files.product_featured_image[0].filename;

    db.query(
      "UPDATE main_product SET product_name=?,product_price=?,product_category=?,product_discount=?,product_image_url=?,product_quantity=?,product_description=? WHERE main_product_id=?",
      [
        product_name,
        product_price,
        product_cat,
        product_discount,
        product_main_image,
        product_qunatity,
        product_description,
        product_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/shop");
        } else {
          res.send(error);
        }
      }
    );
  } else if (req.files.product_secondary_image) {
    product_secondary_image =
      "https://sfinder.app/upload/" +
      req.files.product_secondary_image[0].filename;
    db.query(
      "UPDATE main_product SET product_name=?,product_price=?,product_category=?,product_discount=?,product_quantity=?,product_description=? WHERE main_product_id=?",
      [
        product_name,
        product_price,
        product_cat,
        product_discount,
        product_qunatity,
        product_description,
        product_id,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE main_product_image SET main_product_image_url=? WHERE main_product_id=?",
            [product_secondary_image, product_id],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/shop");
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
  } else if (
    req.files.product_featured_image &&
    req.files.product_secondary_image
  ) {
    product_main_image =
      "https://sfinder.app/upload/" +
      req.files.product_featured_image[0].filename;
    product_secondary_image =
      "https://sfinder.app/upload/" +
      req.files.product_secondary_image[0].filename;
    db.query(
      "UPDATE main_product SET product_name=?,product_price=?,product_category=?,product_discount=?,product_image_url=?,product_quantity=?,product_description=? WHERE main_product_id=?",
      [
        product_name,
        product_price,
        product_cat,
        product_discount,
        product_main_image,
        product_qunatity,
        product_description,
        product_id,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "UPDATE main_product_image SET main_product_image_url=? WHERE main_product_id=?",
            [product_secondary_image, product_id],
            (error1, result1) => {
              if (!error1) {
                res.redirect("/admin/shop");
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
      "UPDATE main_product SET product_name=?,product_price=?,product_category=?,product_discount=?,product_quantity=?,product_description=? WHERE main_product_id=?",
      [
        product_name,
        product_price,
        product_cat,
        product_discount,
        product_qunatity,
        product_description,
        product_id,
      ],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/shop");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.getSubCategory = (req, res) => {
  let main_cat_id = req.params.id;

  db.query(
    "SELECT * FROM product_sub_cateogry WHERE product_main_category=?",
    [main_cat_id],
    (error, result) => {
      if (!error) {
        res.render("product-sub-cateogry", {
          product_sub_category: result,
          main_cat_id: main_cat_id,
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.addSubCategory = (req, res) => {
  let main_cat_id = req.params.id;
  let product_cat_name = req.body.product_cat_name;

  db.query(
    "INSERT INTO product_sub_cateogry (product_sub_cateogry_name,product_main_category) VALUES(?,?)",
    [product_cat_name, main_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editProductSubCategory = (req, res) => {
  let sub_cat_id = req.params.id;
  let product_cat_name = req.body.product_cat_name;
  let main_cat_id = req.body.main_cat_id;

  db.query(
    "UPDATE product_sub_cateogry SET product_sub_cateogry_name=? WHERE product_sub_cateogry_id=?",
    [product_cat_name, sub_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteSubCategory = (req, res) => {
  let sub_cat_id = req.query.sub_cat_id;
  let main_cat_id = req.query.main_cat_id;

  db.query(
    "DELETE FROM product_sub_cateogry WHERE product_sub_cateogry_id=?",
    [sub_cat_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/product-sub-category/" + main_cat_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getShopProductTitle = (req, res) => {
  let product_id = req.params.id;

  db.query(
    "SELECT * FROM direct_order_product WHERE product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        res.render("shop-product-title", {
          product_title: result,
          product_id: product_id,
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.addProductTitle = (req, res) => {
  let product_id = req.params.id;
  let product_title = req.body.product_title;

  db.query(
    "INSERT INTO direct_order_product(product_id,title) VALUES(?,?)",
    [product_id, product_title],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop-product-title/" + product_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editProductTitle = (req, res) => {
  let product_id = req.query.product_id;
  let product_title_id = req.query.product_title_id;
  let product_title = req.body.product_title;

  db.query(
    "UPDATE direct_order_product SET title=? WHERE direct_order_product_id=?",
    [product_title, product_title_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop-product-title/" + product_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteProductTitle = (req, res) => {
  let product_id = req.query.product_id;
  let product_title_id = req.query.product_title_id;

  db.query(
    "DELETE FROM direct_order_product WHERE direct_order_product_id=?",
    [product_title_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop-product-title/" + product_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.getShopProductImage = (req, res) => {
  let product_id = req.params.id;

  db.query(
    "SELECT * FROM main_product_extra_image WHERE product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        res.render("shop-product-image", {
          product_image: result,
          product_id: product_id,
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.addProductImage = (req, res) => {
  let product_id = req.params.id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO main_product_extra_image (product_id,product_image_url) VALUES(?,?)",
    [product_id, pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop-product-image/" + product_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.editProductImage = (req, res) => {
  let product_id = req.query.product_id;
  let product_image_id = req.query.product_image_id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "https://sfinder.app/upload/" + req.file.filename;

    db.query(
      "UPDATE main_product_extra_image SET product_image_url=? WHERE main_product_extra_image_id=?",
      [pic_url, product_image_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/shop-product-image/" + product_id);
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteProductImage = async (req, res) => {
  let product_id = req.query.product_id;
  let product_image_id = req.query.product_image_id;

  const main_product_extra_images = await queryAsync(
    "SELECT * FROM main_product_extra_image WHERE main_product_extra_image_id=?",
    [product_image_id]
  );

  db.query(
    "DELETE FROM main_product_extra_image WHERE main_product_extra_image_id=?",
    [product_image_id],
    (error, result) => {
      if (!error) {
        main_product_extra_images.map((item) => {
          if (item.product_image_url) {
            const path = path.join(
              __dirname,
              "../public/upload/",
              item.product_image_url.split("/").pop()
            );
            fs.unlink(path, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
        res.redirect("/admin/shop-product-image/" + product_id);
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteShop = (req, res) => {
  let product_id = req.params.id;

  db.query(
    "DELETE FROM main_product WHERE main_product_id=?",
    [product_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/shop");
      } else {
        res.send(error);
      }
    }
  );
};
