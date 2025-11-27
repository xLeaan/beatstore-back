const { supabasePublic, supabaseAdmin } = require("../conexion");
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const storage =  multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'imagen_show' }]), async (req, res) => {
    try {
        const { nombre_show, fecha_show, lugar_show, url_show } = req.body;
        const imagen_show = req.files['imagen_show']?.[0];

        if (!imagen_show) return res.status(400).json({ error: 'No se ha subido ninguna imagen' });

        const imagenName = `${Date.now()}-${imagen_show.originalname}`;

        // Subir imagen al bucket
        const { error: uploadImageError } = await supabaseAdmin.storage
            .from('shows')
            .upload(imagenName, imagen_show.buffer, {
                contentType: imagen_show.mimetype,
            });

        if (uploadImageError) throw uploadImageError;

        // Obtener la URL pública
        const { data: imagenData } = supabaseAdmin.storage.from('shows').getPublicUrl(imagenName);

        const imagenUrl =  imagenData.publicUrl;

        // Guardar metadatos en la tabla
        const { error: insertError } = await supabaseAdmin
            .from('shows')
            .insert([{ nombre_show, fecha_show, lugar_show, url_show, imagen_show: imagenUrl }]);
        if (insertError) throw insertError;

        res.json({ message: 'Show subido correctamente', nombre_show, fecha_show, lugar_show, url_show, imagen_show: imagenUrl });
    } catch (error) {
        console.error('Error subiendo el show:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getShows', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('shows')
            .select('*')
            .order('fecha_show', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error obteniendo los shows:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;