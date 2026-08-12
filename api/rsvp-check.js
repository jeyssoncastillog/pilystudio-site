module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { invitacion, grupo_id } = req.body || {};

  // Whitelist allowed invitaciones
  const allowed = ['nieves-y-jesus'];
  if (typeof invitacion !== 'string' || !allowed.includes(invitacion)) {
    return res.status(400).json({ error: 'Parámetro inválido' });
  }
  if (!Number.isInteger(grupo_id)) {
    return res.status(400).json({ error: 'Parámetro inválido' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  try {
    const endpoint =
      `${supabaseUrl}/rest/v1/rsvp` +
      `?invitacion=eq.${encodeURIComponent(invitacion)}` +
      `&grupo_id=eq.${grupo_id}` +
      `&select=grupo_id&limit=1`;

    const upstream = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Accept': 'application/json',
      },
    });

    if (!upstream.ok) {
      return res.status(500).json({ error: 'Error al verificar' });
    }

    const rows = await upstream.json();

    return res.status(200).json({ confirmado: rows.length > 0 });
  } catch (_) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
