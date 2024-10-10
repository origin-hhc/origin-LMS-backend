const express = require("express");
const app = express();
const cors = require("cors");

// database
const connectDB = require("./src/db/database");

// admin routes
const rolesRoute = require("./src/routes/admin/roles");
const permissionsRoute = require("./src/routes/admin/permissions");
const accessGroupsRoute = require("./src/routes/admin/accessGroups");
const categoriesRoute = require("./src/routes/admin/categories");
const usersRoute = require("./src/routes/admin/users");

// routes
const authRoute = require("./src/routes/auth");

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
connectDB();

// // admin routes
app.use("/api/admin", rolesRoute);
app.use("/api/admin", permissionsRoute);
app.use("/api/admin", accessGroupsRoute);
app.use("/api/admin", categoriesRoute);
app.use("/api/admin", usersRoute);
//admin routes end

app.use("/api", authRoute);

app.listen(5001, () => console.log("server is running on port 5001..."));
