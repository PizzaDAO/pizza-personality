// Create table using Supabase Management API
const SUPABASE_ACCESS_TOKEN = 'sbp_bdc15f6e8088c78afde9c1693f6e03dc01615b01';
const SUPABASE_PROJECT_REF = 'hljapqhqmjfbgqogquag';

const sql = `
CREATE TABLE IF NOT EXISTS nft_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  pizza_type TEXT NOT NULL,
  percentages JSONB NOT NULL,
  traits TEXT[] NOT NULL,
  image_url TEXT NOT NULL,
  token_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function createTable() {
  console.log('Creating nft_metadata table via Management API...\n');

  const response = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql
    })
  });

  const result = await response.text();

  if (response.ok) {
    console.log('✓ Table created successfully!');
    console.log('Result:', result);
  } else {
    console.log('Status:', response.status);
    console.log('Response:', result);

    if (response.status === 404) {
      console.log('\nTrying alternative endpoint...');
      // Try the SQL endpoint
      const altResponse = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sql
        })
      });

      const altResult = await altResponse.text();
      console.log('Alt Status:', altResponse.status);
      console.log('Alt Response:', altResult);
    }
  }
}

createTable().catch(console.error);
