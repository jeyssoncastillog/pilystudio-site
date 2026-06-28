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

  const { invitacion, pin } = req.body || {};

  // PIN check — small delay discourages brute force
  const expectedPin = process.env.RSVP_NIEVES_JESUS_PIN;
  if (!expectedPin || !pin || String(pin).trim() !== expectedPin.trim()) {
    await new Promise(r => setTimeout(r, 500));
    return res.status(401).json({ error: 'PIN incorrecto' });
  }

  // Whitelist allowed invitaciones
  const allowed = ['nieves-y-jesus'];
  if (!invitacion || !allowed.includes(invitacion)) {
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
      `&order=fecha_rsvp.desc`;

    const upstream = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Accept': 'application/json',
      },
    });

    if (!upstream.ok) {
      return res.status(500).json({ error: 'Error al consultar respuestas' });
    }

    const rows = await upstream.json();

    const confirmados = rows.filter(r => r.asistencia && r.asistencia.startsWith('Sí'));
    const noAsisten   = rows.filter(r => !r.asistencia || !r.asistencia.startsWith('Sí'));
    const totalPases  = confirmados.reduce((sum, r) => sum + (Number(r.pases) || 0), 0);

    return res.status(200).json({
      total_respuestas:   rows.length,
      total_confirmados:  confirmados.length,
      total_no_asisten:   noAsisten.length,
      total_pases:        totalPases,
      respuestas:         rows,
    });
  } catch (_) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
