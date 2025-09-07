const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());









// MongoDB Verbindung
mongoose.connect("mongodb+srv://Beneschmid:Metallica1981!@musicapp.glgtqic.mongodb.net/MusicApp")
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error("❌ Fehler bei MongoDB Verbindung:", err));

// Song Schema & Model
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    key: String,
    linkUG : String,
    linkSYT: String,
    category: String
});
const Song = mongoose.model("Song" , songSchema);









// Startpunkt (Testroute)

app.get("/", (req, res) => {
  res.send("Backend läuft 🚀");
});








// Alle Songs abrufen

app.get("/songs" , async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({error:"Fehler beim Abrufen der Songs"});
    }
});




// Neuen Song hinzufügen

app.post("/songs", async (req, res) => {
  try {
    const newSong = new Song(req.body); // nimmt JSON-Daten aus dem Request
    await newSong.save();               // speichert in MongoDB
    res.status(201).json(newSong);      // sendet den gespeicherten Song zurück
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Hinzufügen des Songs" });
  }
});


// Song löschen
app.delete("/songs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSong = await Song.findByIdAndDelete(id);
        if (!deletedSong) {
            return res.status(404).json({ error: "Song nicht gefunden" });
        }
        res.json({ message: "Song gelöscht", deletedSong });
    } catch (err) {
        res.status(500).json({ error: "Fehler beim Löschen des Songs" });
    }
});





// Server starten
const PORT = 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
