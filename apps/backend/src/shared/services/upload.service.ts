import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (buffer: Buffer, mimetype: string): Promise<string> => {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const path = `uploads/${filename}`;

    const { data, error } = await supabase.storage
        .from('Fotos')
        .upload(path, buffer, {
            contentType: mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Supabase Upload Error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('Fotos')
        .getPublicUrl(path);

    return publicUrlData.publicUrl;
};

