const express = require("express");
const generalRouter = express.Router();
const db = require("../../config/database");

generalRouter.get("/general-info", (req, res) => {
  db.query("SELECT * FROM general_info", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get general info successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

generalRouter.get("/version", (req, res) => {
  db.query(
    "SELECT version_name, version_url FROM general_info",
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get version successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

generalRouter.get("/notice", (req, res) => {
  db.query(
    "SELECT * FROM notice ORDER BY notice_status DESC",
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get notice successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

generalRouter.get("/contact-us-info", (req, res) => {
  db.query("SELECT * FROM contact_us_info", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get contact us info successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

generalRouter.get("/home-notification", (req, res) => {
  db.query("SELECT * FROM home_notification", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get home notification successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

generalRouter.get("/ic-list", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 50; // Items per page
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM ic_list LIMIT ? OFFSET ?";
  const countQuery = "SELECT COUNT(*) as total FROM ic_list";

  db.query(countQuery, (error, countResult) => {
    if (!error) {
      const totalPages = Math.ceil(countResult[0].total / limit);
      db.query(query, [limit, offset], (error, result) => {
        if (!error) {
          res.send({
            status: "success",
            message: "Get ic list successfully",
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

generalRouter.get("/daily-update", (req, res) => {
  db.query(
    "SELECT * FROM daily_update ORDER BY daily_update_id DESC",
    (error, result) => {
      if (!error) {
        res.send({
          status: "success",
          message: "Get ic list successfully",
          data: result,
        });
      } else {
        res.send(error);
      }
    }
  );
});

// generalRouter.get("/get-divisions", (req, res) => {
//   db.query("SELECT * FROM division", (error, result) => {
//     if (!error) {
//       res.send({
//         status: "success",
//         message: "Get divisions successfully",
//         data: result,
//       });
//     } else {
//       res.send(error);
//     }
//   });
// });

generalRouter.get("/get-divisions", (req, res) => {
  const divisionsQuery = "SELECT * FROM division";
  const districtsQuery = "SELECT * FROM district";

  db.query(divisionsQuery, (divError, divisionsResult) => {
    if (!divError) {
      db.query(districtsQuery, (distError, districtsResult) => {
        if (!distError) {
          res.send({
            status: "success",
            message: "Get divisions and districts successfully",
            data: {
              divisions: divisionsResult,
              districts: districtsResult,
            },
          });
        } else {
          res.status(500).send({
            status: "error",
            message: "Error fetching districts",
            error: distError,
          });
        }
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Error fetching divisions",
        error: divError,
      });
    }
  });
});

generalRouter.get("/app-image", (req, res) => {
  db.query("SELECT * FROM app_image", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get app image successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

generalRouter.get("/alert", (req, res) => {
  db.query("SELECT * FROM alert", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get alert successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

generalRouter.get("/social-media", (req, res) => {
  db.query("SELECT * FROM social_media_links", (error, result) => {
    if (!error) {
      res.send({
        status: "success",
        message: "Get social media link successfully",
        data: result,
      });
    } else {
      res.send(error);
    }
  });
});

module.exports = generalRouter;
