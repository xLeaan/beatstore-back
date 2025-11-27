const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Variables de entorno no definidas (falta URL o SERVICE ROLE)");
}

const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = { supabasePublic, supabaseAdmin };
