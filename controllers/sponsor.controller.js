const db = require("../config/database");
const moment = require("moment-timezone");
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

exports.getPlan = async (req, res) => {
  try {
    const planQuery = `SELECT * FROM sponsor_plan`;

    const plan = await queryAsyncWithoutValue(planQuery);

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;
    const paginated = plan.slice(startIdx, startIdx + perPage);

    return res.status(200).render("plan", {
      title: "Plan List",
      plan,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addPlan = async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const durationInDays = req.body.duration;
    const durationInHours = durationInDays * 24;
    const description = req.body.description;
    const plan_query = `INSERT INTO sponsor_plan (name, price, plan_duration, description) VALUES (?, ?, ?, ?)`;

    await queryAsync(plan_query, [name, price, durationInHours, description]);

    return res.status(200).redirect("/admin/plan");
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.editPlan = async (req, res) => {
  try {
    const { name, price, duration, description } = req.body;
    const { id } = req.params;
    const durationInHours = duration * 24;
    const query = `UPDATE sponsor_plan SET name = ?, price = ?, plan_duration = ?, description = ? WHERE id = ?`;
    await queryAsync(query, [name, price, durationInHours, description, id]);
    return res.redirect("/admin/plan");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM sponsor_plan WHERE id = ?`;
    await queryAsync(query, [id]);
    return res.redirect("/admin/plan");
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getPlanDetail = async (req, res) => {
  try {
    const query = `
      SELECT product_sponsor.*, sponsor_plan.*, user_product.* 
      FROM product_sponsor 
      JOIN sponsor_plan ON product_sponsor.plan_id = sponsor_plan.id 
      JOIN user_product ON product_sponsor.product_id = user_product.user_product_id 
      WHERE product_sponsor.end > NOW()
    `;

    const plan = await queryAsync(query);

    // Convert start and end to Asia/Dhaka timezone
    const planWithLocalTime = plan.map((item) => ({
      ...item,
      start: item.start
        ? moment.utc(item.start).tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss")
        : null,
      end: item.end
        ? moment.utc(item.end).tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss")
        : null,
    }));

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const startIdx = (page - 1) * perPage;
    const paginated = planWithLocalTime.slice(startIdx, startIdx + perPage);

    return res.status(200).render("plan-details", {
      title: "Plan Detail",
      plan: planWithLocalTime,
      paginated,
      perPage,
      page,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
