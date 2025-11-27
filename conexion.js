const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY 
const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY

if (!supabaseUrl || !supabaseAdminKey) {
  throw new Error("Variables de entorno no definidas")
}

const supabasePublic = createClient(supabaseUrl, supabaseKey)

const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey)



module.exports = { supabasePublic, supabaseAdmin }
