const { supabasePublic, supabaseAdmin } = require("../conexion");

module.exports = async (req, res) => {
  const { loginemail, logincontrasena } = req.body;

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: loginemail,
    password: logincontrasena,
  });

  if (error) return res.status(400).json({ error: error.message });

  const { data: usuarioExtra, error: userError } = await supabaseAdmin
    .from("usuarios")
    .select("nombre, apellido, admin")
    .eq("id", data.user.id)
    .single();

  if (userError) return res.status(400).json({ error: userError.message });

  return res.status(200).json({
    user: {
      ...data,
      email: data.user.email,
      nombre: usuarioExtra.nombre,
      apellido: usuarioExtra.apellido,
      admin: usuarioExtra.admin
    },
  });
};
