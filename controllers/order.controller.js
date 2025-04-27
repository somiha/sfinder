const db = require("../config/database");

exports.getOrder = async (req, res) => {
  const order_id = req.query.order_id;
  const status = req.query.status;
  const page = parseInt(req.query.page) || 1;
  const perPage = 8;
  const startIdx = (page - 1) * perPage;
  let result = [];
  if (order_id && status) {
    result = await queryAsync(
      "SELECT * FROM all_order WHERE order_id=? AND order_status=?",
      [order_id, status]
    );
  } else if (order_id) {
    result = await queryAsync("SELECT * FROM all_order WHERE order_id=?", [
      order_id,
    ]);
  } else if (status) {
    result = await queryAsync("SELECT * FROM all_order WHERE order_status=?", [
      status,
    ]);
  } else {
    result = await queryAsync("SELECT * FROM all_order");
  }

  const totalOrders = result.length;

  const paginated = result.slice(startIdx, startIdx + perPage);

  return res.status(200).render("orders", {
    title: "Orders",
    orders: paginated,
    perPage,
    page,
    status,
    order_id,
    totalOrders,
  });
};

exports.editOrder = (req, res) => {
  let order_id = req.params.id;
  let order_note = req.body.order_note;
  let order_status = req.body.order_status;

  db.query(
    "UPDATE all_order SET admin_note=?,order_status=? WHERE order_id=?",
    [order_note, order_status, order_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/order");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getOrderDetails = (req, res) => {
  let order_id = req.params.id;

  db.query(
    "SELECT * FROM all_order WHERE order_id=?",
    [order_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT order_details.product_id,order_details.product_quantity,order_details.product_total_price,main_product.product_name,main_product.product_image_url FROM order_details INNER JOIN main_product ON main_product.main_product_id=order_details.product_id WHERE order_details.order_id=?",
          [order_id],
          (error1, result1) => {
            if (!error1) {
              res.render("order-details", {
                order_details: result,
                order_info: result1,
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

exports.filterOrder = (req, res) => {
  let order_status = req.body.filter_status;
  let order_id = req.body.id;

  console.log(order_status, order_id);

  if (order_id && order_status) {
    return res.redirect(
      `/admin/order?order_id=${order_id}&status=${order_status}`
    );
  } else if (order_id) {
    return res.redirect(`/admin/order?order_id=${order_id}`);
  } else if (order_status) {
    return res.redirect(`/admin/order?status=${order_status}`);
  } else {
    return res.redirect("/admin/order");
  }
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

function queryAsyncWithoutValue(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
