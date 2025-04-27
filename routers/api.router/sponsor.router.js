const express = require("express");
const sponsorRouter = express.Router();
const db = require("../../config/database");

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

sponsorRouter.get("/get-plan", (req, res) => {
  queryAsyncWithoutValue(`SELECT * FROM sponsor_plan`)
    .then((result) => {
      res.status(200).json({ status: "success", data: result });
    })
    .catch((err) => {
      res.status(503).json({ status: "error", msg: "Internal Server Error" });
    });
});

// sponsorRouter.post("/take-plan/:id", async (req, res) => {
//   const { id } = req.params;
//   const product_id = req.body.product_id;

//   const getPlan = `SELECT * FROM sponsor_plan WHERE id = ?`;
//   const getPlanResult = await queryAsync(getPlan, [id]);

//   if (getPlanResult.length === 0) {
//     return res.status(404).json({ msg: "Plan not found" });
//   }

//   const checkSponsor = `SELECT * FROM product_sponsor WHERE product_id = ? AND is_paid = 0 AND end > NOW()`;
//   const checkSponsorResult = await queryAsync(checkSponsor, [product_id]);

//   if (checkSponsorResult.length > 0) {
//     return res
//       .status(400)
//       .json({
//         status: "failed",
//         msg: "Product already sponsored by another plan",
//       });
//   }

//   const getProduct = `SELECT * FROM user_product WHERE user_product_id = ?`;
//   const getProductResult = await queryAsync(getProduct, [product_id]);

//   if (getProductResult.length === 0) {
//     return res.status(404).json({ msg: "Product not found" });
//   }

//   const sponsorQuery = `INSERT INTO product_sponsor (id, product_id, plan_id) VALUES (null, ?, ?)`;

//   const sponsorResult = await queryAsync(sponsorQuery, [
//     product_id,
//     getPlanResult[0].id,
//   ]);

//   if (sponsorResult.affectedRows > 0) {
//     return res.status(200).json({
//       status: "success",
//       msg: "Sponsor added successfully",
//       sponsor_id: sponsorResult.insertId,
//     });
//   }
// });

sponsorRouter.post("/take-plan/:id", async (req, res) => {
  const { id } = req.params;
  const product_id = req.body.product_id;

  const getPlan = `SELECT * FROM sponsor_plan WHERE id = ?`;
  const getPlanResult = await queryAsync(getPlan, [id]);

  if (getPlanResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Plan not found" });
  }

  const checkSponsor = `
  SELECT * 
  FROM product_sponsor 
  WHERE product_id = ? 
    AND (
      is_paid = 0 
      OR (is_paid = 1 AND end > NOW())
    )
`;

  const checkSponsorResult = await queryAsync(checkSponsor, [product_id]);

  if (checkSponsorResult.length > 0) {
    return res.status(400).json({
      status: "failed",
      msg: "Product already sponsored by another plan",
    });
  }

  const getProduct = `SELECT * FROM user_product WHERE user_product_id = ?`;
  const getProductResult = await queryAsync(getProduct, [product_id]);

  if (getProductResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Product not found" });
  }

  const sponsorQuery = `INSERT INTO product_sponsor (id, product_id, plan_id) VALUES (null, ?, ?)`;

  const sponsorResult = await queryAsync(sponsorQuery, [
    product_id,
    getPlanResult[0].id,
  ]);

  if (sponsorResult.affectedRows > 0) {
    return res.status(200).json({
      status: "success",
      msg: "Sponsor added successfully",
      sponsor_id: sponsorResult.insertId,
    });
  }
});

sponsorRouter.get("/get-my-all-plans-not-paid", async (req, res) => {
  const userId = req.query.userId;
  const takePlansQuery = `SELECT * 
FROM product_sponsor AS ps
INNER JOIN user_product AS up 
  ON up.user_product_id = ps.product_id
WHERE up.user_id = ?
  AND ps.is_paid = 0;
  `;

  const takePlansResult = await queryAsync(takePlansQuery, [userId]);

  if (takePlansResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Plans not found" });
  }

  return res.status(200).json({ status: "success", data: takePlansResult });
});

sponsorRouter.post("/update-plan", async (req, res) => {
  const { sponsor_plan_id, plan_id } = req.body;
  const updatePlan = `UPDATE product_sponsor SET plan_id = ? WHERE id = ?`;
  const updatePlanResult = await queryAsync(updatePlan, [
    plan_id,
    sponsor_plan_id,
  ]);

  if (updatePlanResult.affectedRows > 0) {
    return res.status(200).json({ status: "success", msg: "Plan updated" });
  } else {
    return res.status(404).json({ status: "failed", msg: "Plan not found" });
  }
});

sponsorRouter.get("/get-my-all-plans-paid", async (req, res) => {
  const userId = req.query.userId;
  const takePlansQuery = `SELECT * 
FROM product_sponsor AS ps
INNER JOIN user_product AS up 
  ON up.user_product_id = ps.product_id
WHERE up.user_id = ?
  AND ps.is_paid = 1;
  `;

  const takePlansResult = await queryAsync(takePlansQuery, [userId]);

  if (takePlansResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Plans not found" });
  }

  return res.status(200).json({ status: "success", data: takePlansResult });
});

sponsorRouter.delete("/delete-plan/:id", async (req, res) => {
  const { id } = req.params;
  const deletePlan = `DELETE FROM product_sponsor WHERE id = ?`;
  const deletePlanResult = await queryAsync(deletePlan, [id]);

  if (deletePlanResult.affectedRows > 0) {
    return res.status(200).json({ status: "success", msg: "Plan deleted" });
  } else {
    return res.status(404).json({ status: "failed", msg: "Plan not found" });
  }
});

sponsorRouter.post("/pay-sponsor", async (req, res) => {
  const { sponsor_plan_id } = req.body;

  const getProductSponsor = `SELECT * FROM product_sponsor WHERE id = ?`;
  const getProductSponsorResult = await queryAsync(getProductSponsor, [
    sponsor_plan_id,
  ]);

  if (getProductSponsorResult.length === 0) {
    return res
      .status(404)
      .json({ status: "failed", msg: "Product sponsor not found" });
  }

  const getProduct = `SELECT * FROM user_product WHERE user_product_id = ?`;
  const getProductResult = await queryAsync(getProduct, [
    getProductSponsorResult[0].product_id,
  ]);

  if (getProductResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Product not found" });
  }

  const getPlanQuery = `SELECT * FROM sponsor_plan WHERE id = ?`;
  const getPlanResult = await queryAsync(getPlanQuery, [
    getProductSponsorResult[0].plan_id,
  ]);

  if (getPlanResult.length === 0) {
    return res.status(404).json({ status: "failed", msg: "Plan not found" });
  }

  const updateProductSponsor = `UPDATE product_sponsor SET start = now(), end = DATE_ADD(now(), INTERVAL ? HOUR), is_paid = 1 WHERE id = ?`;

  const updateProductSponsorResult = await queryAsync(updateProductSponsor, [
    getPlanResult[0].plan_duration,
    sponsor_plan_id,
  ]);

  const updateUserProduct = `UPDATE user_product SET is_sponsored = 1 WHERE user_product_id = ?`;

  const updateUserProductResult = await queryAsync(updateUserProduct, [
    getProductResult[0].user_product_id,
  ]);

  if (
    updateProductSponsorResult.affectedRows > 0 &&
    updateUserProductResult.affectedRows > 0
  ) {
    return res
      .status(200)
      .json({ status: "success", msg: "Sponsor paid successfully" });
  }
});

// sponsorRouter.get("/get-sponsored-product", async (req, res) => {
//   const getSponsorProduct = `SELECT * FROM user_product WHERE is_sponsored = 1`;

//   const getSponsorProductResult = await queryAsync(getSponsorProduct);

//   if (getSponsorProductResult.length === 0) {
//     return res.status(404).json({ msg: "Product sponsor not found" });
//   }

//   return res
//     .status(200)
//     .json({ status: "success", data: getSponsorProductResult });
// });

sponsorRouter.get("/get-sponsored-product", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE user_product.is_sponsored = 1 AND join1.featured_image = 1 AND user_product.product_status = 1
  `;

  const dataQuery = `
    SELECT * 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE user_product.is_sponsored = 1 AND join1.featured_image = 1 AND user_product.product_status = 1
    LIMIT ? OFFSET ?
  `;

  try {
    const countResult = await queryAsync(countQuery);
    const totalPages = Math.ceil(countResult[0].total / limit);
    const dataResult = await queryAsync(dataQuery, [limit, offset]);

    return res.status(200).json({
      status: "success",
      message: "Get sponsored user products successfully",
      page,
      limit,
      totalPages,
      data: dataResult, // even if empty
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve sponsored products",
      error,
    });
  }
});

sponsorRouter.get("/get-unsponsored-product", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE user_product.is_sponsored = 0 AND join1.featured_image = 1 AND user_product.product_status = 1
  `;

  const dataQuery = `
    SELECT * 
    FROM user_product 
    LEFT JOIN user_product_image AS join1 ON join1.user_product_id = user_product.user_product_id 
    LEFT JOIN user_product_sub_category AS join2 ON join2.user_product_sub_category_id = user_product.product_category 
    LEFT JOIN division AS join3 ON join3.division_id = user_product.location 
    LEFT JOIN district AS join4 ON join4.district_id = user_product.district
    WHERE user_product.is_sponsored = 0 AND join1.featured_image = 1 AND user_product.product_status = 1
    LIMIT ? OFFSET ?
  `;

  try {
    const countResult = await queryAsync(countQuery);
    const totalPages = Math.ceil(countResult[0].total / limit);
    const dataResult = await queryAsync(dataQuery, [limit, offset]);

    return res.status(200).json({
      status: "success",
      message: "Get unsponsored user products successfully",
      page,
      limit,
      totalPages,
      data: dataResult, // empty if nothing found
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve unsponsored products",
      error,
    });
  }
});

// sponsorRouter.get("/get-unsponsored-product", async (req, res) => {
//   const getUnsponsorProduct = `SELECT * FROM user_product WHERE is_sponsored = 0`;

//   const getUnsponsorProductResult = await queryAsync(getUnsponsorProduct);

//   if (getUnsponsorProductResult.length === 0) {
//     return res
//       .status(404)
//       .json({ status: "failed", msg: "Product sponsor not found" });
//   }

//   return res
//     .status(200)
//     .json({ status: "success", data: getUnsponsorProductResult });
// });

// sponsorRouter.post("/remove-sponsor", async (req, res) => {
//   const getSponsorProduct = `SELECT
//     user_product.*,
//     product_sponsor.end < NOW() AS is_expired
// FROM
//     user_product
// INNER JOIN
//     product_sponsor ON user_product.user_product_id = product_sponsor.product_id
// WHERE
//     user_product.is_sponsored = 1;
// `;

//   const getSponsorProductResult = await queryAsync(getSponsorProduct);

//   console.log(getSponsorProductResult);

// if (getSponsorProductResult.length === 0) {
//   return res.status(404).json({ msg: "Product sponsor not found" });
// }

// for (let i = 0; i < getSponsorProductResult.length; i++) {
//   const productSponsor = await queryAsync(
//     "SELECT * FROM product_sponsor WHERE product_id = ? AND end < now()",
//     [getSponsorProductResult[i].user_product_id]
//   );

//   if (productSponsor.length > 0) {
//     const updateProduct = `UPDATE user_product SET is_sponsored = 0 WHERE user_product_id = ?`;

//     const updateProductResult = await queryAsync(updateProduct, [
//       getSponsorProductResult[i].user_product_id,
//     ]);
//   }

//   return res.status(404).json({ msg: "Product sponsor not found" });
// }
// });

sponsorRouter.get("/remove-sponsor", async (req, res) => {
  try {
    const updateSponsors = `
      UPDATE user_product 
      INNER JOIN product_sponsor 
        ON user_product.user_product_id = product_sponsor.product_id
      SET user_product.is_sponsored = 0
      WHERE user_product.is_sponsored = 1
        AND product_sponsor.end < NOW();
    `;

    const getSponsors = `SELECT user_product.*
FROM user_product
INNER JOIN product_sponsor 
  ON user_product.user_product_id = product_sponsor.product_id
WHERE user_product.is_sponsored = 1
  AND product_sponsor.end < NOW();`;

    await queryAsync(updateSponsors);

    return res.status(200).json({
      status: "success",
      msg: "Sponsored products updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", msg: "Internal server error" });
  }
});

sponsorRouter.get("/get-sponsor-not-paid", async (req, res) => {
  const product_id = req.query.product_id;
  const getSponsorProduct = `
    SELECT
      user_product.*, product_sponsor.*, sponsor_plan.name AS plan_name, sponsor_plan.price AS plan_price
    FROM
      user_product
    INNER JOIN
      product_sponsor ON user_product.user_product_id = product_sponsor.product_id
    INNER JOIN
      sponsor_plan ON product_sponsor.plan_id = sponsor_plan.id
    WHERE product_sponsor.is_paid = 0 AND user_product.user_product_id = ?;
  `;

  const getSponsorProductResult = await queryAsync(getSponsorProduct, [
    product_id,
  ]);

  const getSponsorProduct1 = `
    SELECT
      user_product.*, product_sponsor.*, sponsor_plan.name AS plan_name, sponsor_plan.price AS plan_price
    FROM
      user_product
    INNER JOIN
      product_sponsor ON user_product.user_product_id = product_sponsor.product_id
    INNER JOIN
      sponsor_plan ON product_sponsor.plan_id = sponsor_plan.id
    WHERE product_sponsor.is_paid = 1 AND user_product.is_sponsored = 1 AND user_product.user_product_id = ?;
  `;

  const getSponsorProductResult1 = await queryAsync(getSponsorProduct1, [
    product_id,
  ]);

  if (getSponsorProductResult.length === 0) {
    return res
      .status(404)
      .json({ status: "failed", msg: "Product sponsor not found" });
  }

  return res.status(200).json({
    status: "success",
    sponsoredProductNotPaid: getSponsorProductResult,
    sponsoredProductPaid: getSponsorProductResult1,
  });
});

module.exports = sponsorRouter;
