// Pages Function: /api/configs
// Handles all config CRUD via query params
// D1 database bound as DB

export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const headers = { 'Content-Type': 'application/json' };
  const id = url.searchParams.get('id');

  try {
    // GET /api/configs — list all (no id) or get one (with id)
    if (request.method === 'GET') {
      if (id) {
        const row = await env.DB.prepare('SELECT * FROM configs WHERE id = ?').bind(id).first();
        if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        return new Response(JSON.stringify({ ...row, state: JSON.parse(row.state) }), { headers });
      }
      const { results } = await env.DB.prepare(
        'SELECT id, project_name, version, notes, saved_at, pool_width, pool_length, diving_on, cover_box_on FROM configs ORDER BY saved_at DESC LIMIT 100'
      ).all();
      return new Response(JSON.stringify({ configs: results }), { headers });
    }

    // POST /api/configs — save new config
    if (request.method === 'POST') {
      const body = await request.json();
      if (!body.projectName) {
        return new Response(JSON.stringify({ error: 'projectName required' }), { status: 400, headers });
      }
      const newId = crypto.randomUUID();
      const savedAt = new Date().toISOString();
      await env.DB.prepare(
        'INSERT INTO configs (id, project_name, version, notes, saved_at, pool_width, pool_length, diving_on, cover_box_on, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        newId,
        body.projectName,
        body.version || 1,
        body.notes || '',
        savedAt,
        body.state?.poolWidth || 0,
        body.state?.poolLength || 0,
        body.state?.divingOn ? 1 : 0,
        body.state?.coverBoxOn ? 1 : 0,
        JSON.stringify(body.state)
      ).run();
      return new Response(JSON.stringify({ id: newId, saved: true }), { headers });
    }

    // DELETE /api/configs?id=xxx — delete a config
    if (request.method === 'DELETE') {
      if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers });
      await env.DB.prepare('DELETE FROM configs WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ deleted: true }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
