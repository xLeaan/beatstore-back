const { supabasePublic, supabaseAdmin } = require("../conexion");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  console.log("body: ", req.body)

  const { nombre, apellido, email, contrasena, admin } = req.body

  const { data: { user }, error } = await supabaseAdmin.auth.signUp({
    email,
    password: contrasena,
  })


  console.log("user devuelto por Supabase:", user)

  if (error) {
    return res.status(400).json({ error: error.message })
  }


  // 2. Insertar datos extra en tu tabla "usuarios"
  const { error: insertError } = await supabasePublic.from("usuarios").insert([
    {
      id: user.id,
      email: user.email,
      nombre,
      apellido,
      admin: admin || false,
    },
  ])

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  return res.status(201).json({ user })
}
