const express = require("express");
const cors = require("cors");
const { failure } = require("./util/common.js");
const { databaseConnection } = require("./config/database.js");
const userRoutes = require("./routes/user_routes.js");
const authRoutes = require("./routes/auth_routes.js");
const restaurantRoutes = require("./routes/restaurant_routes.js");

const PORT = 8000;
const app = express();

app.use(cors({ origin: "*" })); 
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
    return failure(res, 404, "Not Found", "Request Not Found");
});

databaseConnection(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});