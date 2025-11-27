const { supabasePublic, supabaseAdmin } = require("../conexion");
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const storage =  multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.fields([{ name: "audio" }, { name: "imagen_beat" }]), async (req, res) => {
    try {
        const { nombre_beat, precio, disponible_beat } = req.body;
        const file = req.files["audio"]?.[0];
        const imagen_beat = req.files["imagen_beat"]?.[0];

        if (!file) return res.status(400).json({ error: "No se ha subido ningún archivo" });

        const fileName = `${Date.now()}-${file.originalname}`;

        // Subir beat al bucket
        const { error: uploadError } = await supabaseAdmin.storage
            .from("beats") // nombre del bucket
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) throw uploadError;
        
        const imagenName = `${Date.now()}-${imagen_beat.originalname}`;
        // Subir imagen al bucket
        const { error: uploadImageError } = await supabaseAdmin.storage
            .from("beats")
            .upload(imagenName, imagen_beat.buffer, {
                contentType: imagen_beat.mimetype,
            })

        if (uploadImageError) throw uploadImageError;

        // Obtener la URL pública
        const { data: publicData } = supabaseAdmin.storage.from("beats").getPublicUrl(fileName);
        const { data: imagenData } = supabaseAdmin.storage.from("beats").getPublicUrl(imagenName);

        const beatUrl =  publicData.publicUrl;
        const imagenUrl =  imagenData.publicUrl;

        // Guardar metadatos en la tabla
        const { error: insertError } = await supabaseAdmin
            .from("beats")
            .insert([{ nombre_beat: nombre_beat, url_beat: beatUrl, precio, disponible_beat, imagen_beat: imagenUrl }]);

        if (insertError) throw insertError;


        res.json({ message: "Beat subido correctamente", url: beatUrl, nombre_beat, precio, disponible_beat });
    } catch (error) {
        console.error("Error subiendo el beat:", error);
        res.status(500).json({ error: error.message });
    }
})

router.get("/getBeats", async (req, res) => {
  try {
    const { data, error } = await supabasePublic
      .from("beats")
      .select("id_beat, nombre_beat, url_beat, precio, disponible_beat, created_at, imagen_beat")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error obteniendo beats:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
