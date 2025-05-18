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

exports.getDashboard = async (req, res) => {
  try {
    // pending orders count
    const pendingOrdersCount = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM all_order WHERE order_status='Pending'"
    );

    const deliveredOrdersCount = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM all_order WHERE order_status='Delivered'"
    );

    const totalUnseenMessages = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM message WHERE is_seen = 0"
    );

    const toalUserReports = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM user_report INNER JOIN user ON user.user_id=user_report.user_id"
    );

    const totalUserReset = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM user_reset INNER JOIN user ON user.user_id=user_reset.user_id WHERE user_reset.status =0"
    );

    const toalFileRequests = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM file_request INNER JOIN user ON user.user_id=file_request.user_id ORDER BY file_request.is_seen"
    );

    const totalPersonalRequests = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM personal_request_content INNER JOIN user ON user.user_id=personal_request_content.user_id ORDER BY personal_request_content.is_seen"
    );

    const totalPendingBuySells = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM user_product INNER JOIN user ON user.user_id = user_product.user_id WHERE user_product.product_status = 0"
    );

    const totalFreelancerPendings = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM freelancer WHERE freelancer_acc_status = -1"
    );

    // const getFreelancerWithdrawQuery = `
    //   SELECT COUNT(*) AS count,
    //     freelancer_balance_withdraw.*,
    //     freelancer.freelancer_id,
    //     freelancer.freelancer_name
    //   FROM freelancer_balance_withdraw
    //   INNER JOIN freelancer ON freelancer_balance_withdraw.freelancer_id = freelancer.freelancer_id WHERE freelancer_balance_withdraw.status = 0
    // `;

    const getFreelancerWithdrawQuery = `
      SELECT 
    COUNT(*) AS count,
    freelancer_balance_withdraw.freelancer_id,
    freelancer.freelancer_name
FROM freelancer_balance_withdraw
INNER JOIN freelancer 
    ON freelancer_balance_withdraw.freelancer_id = freelancer.freelancer_id
WHERE freelancer_balance_withdraw.status = 0
GROUP BY freelancer_balance_withdraw.freelancer_id, freelancer.freelancer_name;

    `;

    let freelancerWithdraw = await queryAsyncWithoutValue(
      getFreelancerWithdrawQuery
    );

    const subscriptionOveredUsers = await queryAsyncWithoutValue(
      `SELECT COUNT(*) AS count FROM package_enrollment as pe
     LEFT JOIN user as u
     ON pe.user_id = u.user_id
     WHERE created_at > NOW() - INTERVAL 1 YEAR`
    );

    const oneYearOveredVerifiedUser = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM user WHERE last_verification_date < NOW() - INTERVAL 1 YEAR AND user_verification = 1"
    );

    const courseEnrollment = await queryAsyncWithoutValue(
      "SELECT COUNT(*) AS count FROM course_enrollment WHERE end_time > NOW() AND is_active = 1"
    );

    const freelancerEnrollments = await queryAsyncWithoutValue(
      `SELECT COUNT(*) AS count FROM freelancer_enrollment
      INNER JOIN freelancer ON freelancer_enrollment.freelancer_id = freelancer.freelancer_id
      WHERE freelancer.freelancer_acc_status != -1 AND freelancer_enrollment.status = 0`
    );

    const status = req.query.status;
    if (status) {
      freelancerWithdraw = freelancerWithdraw.filter(
        (withdraw) => withdraw.status === status
      );
    }

    return res.status(200).render("dashboard", {
      title: "Dashboard",
      pendingOrdersCount: pendingOrdersCount[0]?.count || 0,
      deliveredOrdersCount: deliveredOrdersCount[0]?.count || 0,
      totalUnseenMessages: totalUnseenMessages[0]?.count || 0,
      totalUserReports: toalUserReports[0]?.count || 0,
      totalUserReset: totalUserReset[0]?.count || 0,
      toalFileRequests: toalFileRequests[0]?.count || 0,
      totalPersonalRequests: totalPersonalRequests[0]?.count || 0,
      totalPendingBuySells: totalPendingBuySells[0]?.count || 0,
      totalFreelancerPendings: totalFreelancerPendings[0]?.count || 0,
      freelancerWithdraw: freelancerWithdraw[0]?.count || 0,
      subscriptionOveredUsers: subscriptionOveredUsers[0]?.count || 0,
      oneYearOveredVerifiedUser: oneYearOveredVerifiedUser[0]?.count || 0,
      freelancerEnrollments: freelancerEnrollments[0]?.count || 0,
      courseEnrollment: courseEnrollment[0]?.count || 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
