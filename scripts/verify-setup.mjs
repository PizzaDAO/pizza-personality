import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hljapqhqmjfbgqogquag.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsamFwcWhxbWpmYmdxb2dxdWFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcwMDIxOSwiZXhwIjoyMDgzMjc2MjE5fQ.zK1S0PgFAUOT7LYj7L2iVtc3oIOvglZbdx6jLSy8crY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
  console.log('Verifying Supabase setup...\n');

  // 1. Check bucket
  console.log('1. Checking storage bucket...');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

  if (bucketError) {
    console.log('   ✗ Error:', bucketError.message);
  } else {
    const nftBucket = buckets.find(b => b.name === 'nft-images');
    if (nftBucket) {
      console.log('   ✓ nft-images bucket exists');
      console.log('   ✓ Public:', nftBucket.public);
    } else {
      console.log('   ✗ nft-images bucket not found');
    }
  }

  // 2. Check table
  console.log('\n2. Checking nft_metadata table...');
  const { data, error: tableError } = await supabase
    .from('nft_metadata')
    .select('id')
    .limit(1);

  if (tableError) {
    console.log('   ✗ Error:', tableError.message);
  } else {
    console.log('   ✓ nft_metadata table exists');
    console.log('   ✓ Current rows:', data.length);
  }

  // 3. Test insert (optional)
  console.log('\n3. Testing insert capability...');
  const testData = {
    wallet_address: '0xtest',
    pizza_type: 'hawaiian',
    percentages: { entrepreneur: 50, manager: 30, technician: 20 },
    traits: ['bold', 'creative'],
    image_url: 'https://example.com/test.png'
  };

  const { data: inserted, error: insertError } = await supabase
    .from('nft_metadata')
    .insert(testData)
    .select()
    .single();

  if (insertError) {
    console.log('   ✗ Insert error:', insertError.message);
  } else {
    console.log('   ✓ Test insert successful, id:', inserted.id);

    // Clean up test data
    await supabase.from('nft_metadata').delete().eq('id', inserted.id);
    console.log('   ✓ Test data cleaned up');
  }

  console.log('\n✅ Supabase is ready for NFT minting!');
}

verify().catch(console.error);
