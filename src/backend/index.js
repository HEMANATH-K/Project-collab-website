import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import natural from "natural";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- Database Connection ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "goutham007",
  database: "Users" // your login/auth database
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ---------------- Cosine Similarity ----------------
function computeSimilarity(str1, str2) {
  const tokenizer = new natural.WordTokenizer();
  const words1 = tokenizer.tokenize(str1.toLowerCase());
  const words2 = tokenizer.tokenize(str2.toLowerCase());
  const allWords = Array.from(new Set([...words1, ...words2]));
  const vec1 = allWords.map(word => words1.filter(w => w === word).length);
  const vec2 = allWords.map(word => words2.filter(w => w === word).length);
  return 1 - natural.Distance.cosine(vec1, vec2); // similarity 0-1
}

// ---------------- User APIs ----------------
// Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).send({ message: "❌ Email already registered" });
        return res.status(500).send(err);
      }
      res.send({ message: "✅ User Registered! Please login." });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: "❌ User not found" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).send({ message: "❌ Wrong password" });

    res.send({ message: "✅ Login successful!", user: { id: user.id, name: user.name, email: user.email } });
  });
});

// ---------------- Dashboard APIs ----------------
// Get Projects by User
app.get("/projects/:userId", (req, res) => {
  const { userId } = req.params;
  db.query("SELECT * FROM projects WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// ---------------- Collaboration APIs ----------------
// Get collaboration invitations for a user
app.get("/collaborations/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.id, p.name AS project, u.name AS from_user, c.status
    FROM collaborations c
    JOIN projects p ON c.project_id = p.id
    JOIN users u ON c.invited_by = u.id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Accept / Reject invitation
app.post("/collaborations/:id/respond", (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "accepted" or "rejected"

  if (!["accepted", "rejected"].includes(action)) return res.status(400).send({ message: "Invalid action" });

  db.query("UPDATE collaborations SET status = ? WHERE id = ?", [action, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: `✅ Invitation ${action}` });
  });
});

// Match projects based on skills
app.post("/match-projects", (req, res) => {
  const { skills } = req.body; // array of skills
  if (!skills || skills.length === 0) return res.status(400).send({ message: "No skills provided" });

  db.query("SELECT * FROM projects", (err, projects) => {
    if (err) return res.status(500).send(err);

    const userSkillsStr = skills.join(" ");
    const matches = projects.map(project => {
      const projectSkillsStr = project.technologies; // assuming stored as string e.g. "React,Node.js"
      const similarity = computeSimilarity(userSkillsStr, projectSkillsStr);
      return { ...project, similarity: parseFloat(similarity.toFixed(2)) };
    });

    matches.sort((a, b) => b.similarity - a.similarity);
    res.send(matches);
  });
});
// GET /users/:id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, role FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: "User not found" });
    res.send(result[0]);
  });
});
// PUT /users/:id// PUT /users/:id
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  db.query(
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Profile updated successfully" });
    }
  );
});


// ---------------- Start Server ----------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
