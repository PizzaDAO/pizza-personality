import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. NFT minting will not work.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export const STORAGE_BUCKET = 'nft-images'

export interface NFTMetadata {
  id?: string
  wallet_address: string
  pizza_type: string
  percentages: {
    entrepreneur: number
    organizer: number
    technician: number
  }
  traits: string[]
  image_url: string
  token_id?: number
  created_at?: string
}

// Upload image to Supabase Storage
export async function uploadImage(imageBlob: Blob, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, imageBlob, {
      contentType: 'image/png',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// Store NFT metadata
export async function storeMetadata(metadata: NFTMetadata): Promise<NFTMetadata> {
  const { data, error } = await supabase
    .from('nft_metadata')
    .insert(metadata)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to store metadata: ${error.message}`)
  }

  return data
}

// Update token ID after minting
export async function updateTokenId(metadataId: string, tokenId: number): Promise<void> {
  const { error } = await supabase
    .from('nft_metadata')
    .update({ token_id: tokenId })
    .eq('id', metadataId)

  if (error) {
    throw new Error(`Failed to update token ID: ${error.message}`)
  }
}

// Generate metadata JSON URL for NFT
export function generateMetadataUrl(metadataId: string): string {
  return `${supabaseUrl}/rest/v1/nft_metadata?id=eq.${metadataId}&select=*`
}
