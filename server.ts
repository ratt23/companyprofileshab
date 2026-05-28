import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { defaultDatabaseState } from "./src/default_data_payload.js";
import { DatabaseState, Doctor } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3010;

  // Middleware to parse JSON
  app.use(express.json());

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "database.json");

  // Read data from database.json or initialize with defaultDatabaseState
  const readDatabase = (): DatabaseState => {
    try {
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error("Error reading database file, resetting to default:", error);
    }
    // Write defaults
    fs.writeFileSync(dbPath, JSON.stringify(defaultDatabaseState, null, 2), "utf-8");
    return defaultDatabaseState;
  };

  const writeDatabase = (data: DatabaseState) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  };

  // API Route: Get complete database state
  app.get("/api/data", (req, res) => {
    try {
      const db = readDatabase();
      res.json(db);
    } catch (err) {
      res.status(500).json({ error: "Failed to read database state" });
    }
  });

  // API Route: Update complete database state
  app.post("/api/data", (req, res) => {
    try {
      const newData = req.body as DatabaseState;
      if (!newData || !newData.doctors || !newData.stats || !newData.facilities) {
        res.status(400).json({ error: "Invalid data format" });
        return;
      }
      writeDatabase(newData);
      res.json({ success: true, message: "Database updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to write database state" });
    }
  });

  // API Route: Get all doctors
  app.get("/api/doctors", (req, res) => {
    try {
      const db = readDatabase();
      res.json(db.doctors);
    } catch (err) {
      res.status(500).json({ error: "Failed to get doctors" });
    }
  });

  // API Route: Add a doctor
  app.post("/api/doctors", (req, res) => {
    try {
      const db = readDatabase();
      const newDoc = req.body as Doctor;
      if (!newDoc.name || !newDoc.specialty || !newDoc.department) {
        res.status(400).json({ error: "Name, specialty, and department are required." });
        return;
      }
      if (!newDoc.id) {
        newDoc.id = "doc-" + Date.now();
      }
      db.doctors.push(newDoc);
      writeDatabase(db);
      res.status(201).json(newDoc);
    } catch (err) {
      res.status(500).json({ error: "Failed to add doctor" });
    }
  });

  // API Route: Update individual doctor
  app.put("/api/doctors/:id", (req, res) => {
    try {
      const db = readDatabase();
      const docId = req.params.id;
      const index = db.doctors.findIndex((d) => d.id === docId);
      if (index === -1) {
        res.status(404).json({ error: `Doctor with id ${docId} not found` });
        return;
      }
      db.doctors[index] = { ...db.doctors[index], ...req.body, id: docId };
      writeDatabase(db);
      res.json(db.doctors[index]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update doctor" });
    }
  });

  // API Route: Delete doctor
  app.delete("/api/doctors/:id", (req, res) => {
    try {
      const db = readDatabase();
      const docId = req.params.id;
      const filtered = db.doctors.filter((d) => d.id !== docId);
      if (filtered.length === db.doctors.length) {
        res.status(404).json({ error: `Doctor with id ${docId} not found` });
        return;
      }
      db.doctors = filtered;
      writeDatabase(db);
      res.json({ success: true, message: `Doctor with id ${docId} deleted` });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete doctor" });
    }
  });

  // API Route: Get statistics
  app.get("/api/stats", (req, res) => {
    try {
      const db = readDatabase();
      res.json(db.stats);
    } catch (err) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // API Route: Update stats
  app.put("/api/stats", (req, res) => {
    try {
      const db = readDatabase();
      db.stats = req.body;
      writeDatabase(db);
      res.json({ success: true, stats: db.stats });
    } catch (err) {
      res.status(500).json({ error: "Failed to update stats" });
    }
  });

  // API Route: Get facilities
  app.get("/api/facilities", (req, res) => {
    try {
      const db = readDatabase();
      res.json(db.facilities);
    } catch (err) {
      res.status(500).json({ error: "Failed to get facilities" });
    }
  });

  // API Route: Update individual facility
  app.put("/api/facilities/:id", (req, res) => {
    try {
      const db = readDatabase();
      const facId = req.params.id;
      const index = db.facilities.findIndex((f) => f.id === facId);
      if (index === -1) {
        res.status(404).json({ error: `Facility with id ${facId} not found` });
        return;
      }
      db.facilities[index] = { ...db.facilities[index], ...req.body, id: facId };
      writeDatabase(db);
      res.json(db.facilities[index]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update facility" });
    }
  });

  // Vite integration as middleware (dev vs prod mode)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // API Route: Get real-time social stats (Google Maps & Instagram)
  app.get("/api/social-stats", async (req, res) => {
    try {
      const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
      const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      const placeId = process.env.GOOGLE_PLACE_ID || "ChIJH-Q2sO-pcS4RsVf2PZcwWq8"; // Default Place ID Siloam Ambon

      // 1. Fetch Google Maps Data
      let googleData = {
        rating: 4.8,
        reviewsCount: "1.5K",
        status: "Rumah Sakit • Buka 24 Jam"
      };

      if (googleApiKey && placeId) {
        try {
          const gRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,current_opening_hours&key=${googleApiKey}`);
          const gJson = await gRes.json();
          if (gJson.result) {
            googleData.rating = gJson.result.rating || 4.8;
            googleData.reviewsCount = gJson.result.user_ratings_total 
              ? (gJson.result.user_ratings_total > 999 
                  ? (gJson.result.user_ratings_total / 1000).toFixed(1) + "K" 
                  : gJson.result.user_ratings_total.toString())
              : "1.5K";
            googleData.status = gJson.result.current_opening_hours?.open_now ? "Rumah Sakit • Buka 24 Jam (Buka)" : "Rumah Sakit • Buka 24 Jam";
          }
        } catch (error) {
          console.error("Google Places API error:", error);
        }
      }

      // 2. Fetch Instagram Data
      let instagramData = [
        { id: "mock1", media_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80", caption: "Post 1" },
        { id: "mock2", media_url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&q=80", caption: "Post 2" },
        { id: "mock3", media_url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=500&q=80", caption: "Post 3" }
      ];

      if (igToken) {
        try {
          const igRes = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink&access_token=${igToken}&limit=3`);
          const igJson = await igRes.json();
          if (igJson.data && igJson.data.length > 0) {
            // Filter to only get images/carousels (not video, unless you want video thumbnails)
            instagramData = igJson.data
              .filter((media: any) => media.media_url)
              .slice(0, 3)
              .map((media: any) => ({
                id: media.id,
                media_url: media.media_url,
                caption: media.caption || "Instagram Post"
              }));
          }
        } catch (error) {
          console.error("Instagram API error:", error);
        }
      }

      res.json({
        google: googleData,
        instagram: instagramData
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch social stats" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Siloam Hospitals Corporate Profile running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
