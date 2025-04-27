const db = require("../config/database");
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

exports.getSubscriptionOveredUsers = async (req, res) => {
  try {
    const getSubscriptionOveredUsersQuery = `SELECT * FROM package_enrollment as pe
     LEFT JOIN user as u
     ON pe.user_id = u.user_id
     WHERE created_at < NOW() - INTERVAL 1 YEAR;`;

    const subscriptionOveredUsers = await queryAsyncWithoutValue(
      getSubscriptionOveredUsersQuery
    );

    console.log(subscriptionOveredUsers);

    return res.render("subscription-overed-user", {
      subscriptionOveredUsers: subscriptionOveredUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteSubscriptionOveredUser = async (req, res) => {
  try {
    const { id } = req.query;

    const query = `DELETE FROM package_enrollment WHERE user_id = ?`;

    const result = await queryAsync(query, [id]);

    return res.redirect("/admin/subscription-overed-users");
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteAllSubscriptionOveredUsers = async (req, res) => {
  try {
    const query = `DELETE FROM package_enrollment WHERE created_at < NOW() - INTERVAL 1 YEAR`;

    const result = await queryAsync(query);

    return res.redirect("/admin/subscription-overed-users");
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
