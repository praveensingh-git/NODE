const express = require("express");
const users = require("./export.json");
const app = express();
const PORT = 8000;
const fs = require("fs");

app.use(express.urlencoded({ extended: false })); //middleware - plugin

app.get("/api/users", (req, res) => {
  return res.json(users);
});
app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    // ':' for dynamic routing
    const id = req.params.id;
    const user = users.find((user) => user.id == id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) return res.status(404).JSON({ error: "User not found" });
    Object.assign(users.req.body);
    fs.writeFile('./export.json',JSON.stringify(users),(err)=>{
    if(err) res.status(500).JSON({error:"Failed to update File"})
    return res.json({staus:"File updated Successfully"})
    })
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((idx) => idx.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
    users.splice(index, 1);
    fs.writeFile("./export.json", JSON.stringify(users), (err) => {
      if (err) return res.status(500).JSON({ error: "Failed to upload File" });
      return res.json({ status: "deleted", id });
    });
  });
app.post("/api/users", (req, res) => {
  const body = req.body; //app.use(express.urlencoded({extended:false}))
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./export.json", JSON.stringify(users), (err, data) =>
    res.json({ status: "sucess", id: users.length })
  );
  console.log(body);
});
app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
