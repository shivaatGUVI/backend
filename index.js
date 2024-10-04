const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
dotenv.config();

const application = express();

application.use(cors("*"));

application.get("/contents", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${process.env.USER}/${process.env.OS_REPO}/contents/contents.js`,
      {
        auth: process.env.TOKEN,
      }
    );

    console.log(response);

    const data = response.data;
    const binaryContent = Buffer.from(data.content, "base64").toString("utf-8");
    const jsonContent = eval(binaryContent);

    return res.json({ status: "success", data: jsonContent });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});

application.get("/file-content", async (req, res) => {
  const { file } = req.query;

  console.log(file);

  try {
    const responseFromServer = await axios.get(
      `https://raw.githubusercontent.com/${process.env.USER}/${process.env.OS_REPO}/master/${file}.md`,
      {
        auth: process.env.TOKEN,
      }
    );

    const data = responseFromServer.data;

    return res.json({ status: "success", data: data });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error" });
  }
});

application.listen(8080, () => {
  console.log("Server started");
});
