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

exports.getChatAlerts = (req, res) => {
  db.query("SELECT * FROM chat_alert", (error, result) => {
    if (!error) {
      console.log(result);

      res.render("chat-alert", { chat: result });
    } else {
      res.send(error);
    }
  });
};

exports.updateChatAlert = async (req, res) => {
  const { user_seller, user_freelancer } = req.body;
  console.log(user_seller, user_freelancer);

  const alert = await queryAsyncWithoutValue("SELECT * from chat_alert");
  if (alert && alert.length) {
    const id = alert[0].id;
    await queryAsync(
      "UPDATE chat_alert SET user_freelancer = ?, user_seller = ? WHERE id = ?",
      [user_freelancer, user_seller, id]
    );
    res.redirect("/admin/chat-alert");
  }
};
