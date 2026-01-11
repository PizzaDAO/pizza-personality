import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hljapqhqmjfbgqogquag.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsamFwcWhxbWpmYmdxb2dxdWFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcwMDIxOSwiZXhwIjoyMDgzMjc2MjE5fQ.zK1S0PgFAUOT7LYj7L2iVtc3oIOvglZbdx6jLSy8crY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setup() {
  console.log('Setting up Supabase for NFT minting...\n');

  // 1. Create storage bucket
  console.log('1. Creating storage bucket "nft-images"...');
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('nft-images', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
  });

  if (bucketError) {
    if (bucketError.message.includes('already exists')) {
      console.log('   Bucket already exists, skipping...');
    } else {
      console.error('   Error creating bucket:', bucketError.message);
    }
  } else {
    console.log('   Bucket created successfully!');
  }

  // 2. Create nft_metadata table
  console.log('\n2. Creating table "nft_metadata"...');
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (tableError) {
    // Try direct SQL via REST API
    console.log('   RPC not available, trying direct table creation...');

    const { error: insertError } = await supabase
      .from('nft_metadata')
      .select('id')
      .limit(1);

    if (insertError && insertError.code === '42P01') {
      // Table doesn't exist, need to create via SQL editor
      console.log('   Table does not exist. Please create it manually in Supabase SQL editor:');
      console.log(`
   CREATE TABLE nft_metadata (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     wallet_address TEXT NOT NULL,
     pizza_type TEXT NOT NULL,
     percentages JSONB NOT NULL,
     traits TEXT[] NOT NULL,
     image_url TEXT NOT NULL,
     token_id INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
      `);
    } else if (insertError) {
      console.error('   Error:', insertError.message);
    } else {
      console.log('   Table already exists!');
    }
  } else {
    console.log('   Table created successfully!');
  }

  // 3. Test bucket access
  console.log('\n3. Testing bucket access...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('   Error listing buckets:', listError.message);
  } else {
    const nftBucket = buckets.find(b => b.name === 'nft-images');
    if (nftBucket) {
      console.log('   ✓ nft-images bucket is accessible');
      console.log('   Public:', nftBucket.public);
    } else {
      console.log('   ✗ nft-images bucket not found');
    }
  }

  console.log('\nSetup complete!');
}

setup().catch(console.error);
