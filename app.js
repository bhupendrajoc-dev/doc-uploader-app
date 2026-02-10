require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const uploadToS3 = require("./helpers/s3");
const db = require("./helpers/db");
const config = require("./helpers/config");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const upload = multer({ storage: multer.memoryStorage() });

/* ---------------- Upload handler ---------------- */

app.post("/upload", upload.single("file"), async (req, res) => {
  try {

    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const key = `${Date.now()}-${file.originalname}`;
    console.log("Uploading file to S3 with key:", key);
    try{
        await uploadToS3(file)
    }catch(err){
      console.error("Error during S3 upload:", err);
      return res.status(500).send("S3 upload failed");
    }
    
    res.send(`
      <p>File uploaded successfully</p>
      <a href="/">Upload another file</a>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});


/* ---------------- List uploaded files ---------------- */

app.get("/files", async (req, res) => {
  try {
    db.query(
      "SELECT id, filename, s3key, uploaded_at FROM uploads ORDER BY id DESC",(err, rows) =>{
        if(err){
          console.error("DB query error:", err);
          res.status(500).send("Failed to fetch files");
        }else{
            console.log("Sample file record:", rows);
            let tableRows = "";
            if(rows.length === 0){
                tableRows = `
                    <tr>
                    <td colspan="4">No files uploaded yet</td>
                    </tr>
                `;
            }else{
                rows.forEach(r => {
                tableRows += `
                    <tr>
                        <td>${r.id}</td>
                        <td>${r.filename}</td>
                        <td>${r.s3key}</td>
                        <td>${r.uploaded_at}</td>
                    </tr>
                `;
                });
                console.log("Generated HTML table rows for files", tableRows);
            }
            const fs = require("fs");
            const path = require("path");

            const filePath = path.join(__dirname, "public", "files.html");
            let html = fs.readFileSync(filePath, "utf8");

            html = html.replace(
            '<tbody id="filesTableBody"></tbody>',
            `<tbody id="filesTableBody">${tableRows}</tbody>`
            );
            res.send(html);
        }
    }
    );
  } catch (err) {
    console.log("Error fetching files:", err);
    res.status(500).send("Failed to fetch files");
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
