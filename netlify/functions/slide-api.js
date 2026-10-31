import postgres from 'postgres';

let sql;

if (process.env.NEON_DATABASE_URL) {
  sql = postgres(process.env.NEON_DATABASE_URL, {
    ssl: 'require',
    idle_timeout: 5,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
    prepare: false,
  });
} else {
  console.warn('⚠️ NEON_DATABASE_URL is missing! Database features will not work.');
  sql = {
    unsafe: async () => {
      throw new Error('Database connection invalid. Please check NEON_DATABASE_URL environment variable.');
    }
  };
}

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 5 min cache
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let path = event.path || '';
    path = path.replace(/^\/.netlify\/functions\/slide-api/, '');

    // ==========================================
    // GET /doctors — All doctors with SSTV images
    // ==========================================
    if ((path === '/doctors' || path === '/doctors/' || path === '') && event.httpMethod === 'GET') {
      const doctors = await sql.unsafe(`
        SELECT 
          d.id,
          d.name,
          d.specialty,
          d.image_url,
          d.schedule,
          s.image_url AS sstv_image_url
        FROM doctors d
        LEFT JOIN sstv_images s ON d.id = s.doctor_id
        ORDER BY d.specialty ASC, d.name ASC
      `);

      // Group by specialty
      const grouped = {};
      for (const doc of doctors) {
        const key = doc.specialty || 'Umum';
        if (!grouped[key]) {
          grouped[key] = {
            specialty: key,
            doctors: []
          };
        }
        grouped[key].doctors.push({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          // Priority: SSTV image > profile image > null
          image_url: doc.sstv_image_url || doc.image_url || null,
          profile_image_url: doc.image_url || null,
          schedule: doc.schedule,
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          groups: Object.values(grouped),
          total: doctors.length,
          fetched_at: new Date().toISOString()
        })
      };
    }

    // ==========================================
    // GET /promos — Active promo images
    // ==========================================
    if (path === '/promos' || path === '/promos/') {
      const promos = await sql.unsafe(`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.image_url,
          p.sort_order,
          s.image_url AS sstv_image_url
        FROM promos p
        LEFT JOIN sstv_images s ON p.id = s.promo_id
        WHERE p.is_active = true
        ORDER BY p.sort_order ASC, p.created_at DESC
      `);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(promos.map(p => ({
          ...p,
          display_image: p.sstv_image_url || p.image_url || null
        })))
      };
    }

    // ==========================================
    // GET /settings — Slideshow settings
    // ==========================================
    if (path === '/settings' || path === '/settings/') {
      const settings = await sql.unsafe(`
        SELECT setting_key, setting_value, is_enabled
        FROM app_settings 
        WHERE setting_key IN (
          'slideshow_refresh_interval',
          'slideshow_slide_duration',
          'manager_title'
        )
      `);

      const settingsMap = {};
      for (const s of settings) {
        settingsMap[s.setting_key] = {
          value: s.setting_value,
          enabled: s.is_enabled
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(settingsMap)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' })
    };

  } catch (error) {
    console.error('[slide-api] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
}
