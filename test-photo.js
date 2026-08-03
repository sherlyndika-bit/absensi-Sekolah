import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if (k && v) acc[k.trim()] = v.trim();
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
async function checkPhoto() {
  const { data, error } = await supabase.from('users').select('id, name, face_enrollment_status, photo_url').eq('face_enrollment_status', 'pending');
  if (error) console.error(error);
  else {
    console.log('Pending students:', data.length);
    data.forEach(s => {
      console.log(`Student: ${s.name}, Photo length: ${s.photo_url ? s.photo_url.length : 'NULL'}`);
      if (s.photo_url && s.photo_url.length < 100) {
        console.log(`Photo content: ${s.photo_url}`);
      }
    });
  }
}
checkPhoto();
