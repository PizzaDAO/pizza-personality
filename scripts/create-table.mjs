// Create table using Supabase Management API
const SUPABASE_PROJECT_REF = 'hljapqhqmjfbgqogquag';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsamFwcWhxbWpmYmdxb2dxdWFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcwMDIxOSwiZXhwIjoyMDgzMjc2MjE5fQ.zK1S0PgFAUOT7LYj7L2iVtc3oIOvglZbdx6jLSy8crY';

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
  console.log('Creating nft_metadata table via REST API...');

  const response = await fetch(`https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql
    })
  });

  if (!response.ok) {
    // Try the SQL endpoint directly via pg
    console.log('RPC failed, trying direct postgres connection...');

    // Use supabase-js to run raw SQL via postgrest
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      `https://${SUPABASE_PROJECT_REF}.supabase.co`,
      SUPABASE_SERVICE_KEY,
      {
        db: { schema: 'public' }
      }
    );

    // Try inserting a test record to force table check
    const { error } = await supabase.from('nft_metadata').select('id').limit(1);

    if (error?.code === '42P01') {
      console.log('\nTable does not exist. Creating via pg...');

      // Unfortunately, Supabase REST API doesn't support DDL
      // We need to use the Supabase CLI or dashboard
      console.log('\nPlease run this SQL in Supabase Dashboard > SQL Editor:');
      console.log('-----------------------------------------------------------');
      console.log(sql);
      console.log('-----------------------------------------------------------');
      console.log('\nOr use: npx supabase db push');
    } else if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Table already exists!');
    }
  } else {
    console.log('Table created!');
  }
}

createTable().catch(console.error);
