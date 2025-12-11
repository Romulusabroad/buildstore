require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function check() {
    console.log('--- DIAGNOSTIC START ---');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    const supabase = createClient(url, key);

    console.log('Testing specific query...');
    const ownerId = '00000000-0000-0000-0000-000000000000';

    try {
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('owner_id', ownerId);

        if (error) {
            console.error('FAIL: Query returned error:', JSON.stringify(error, null, 2));
        } else {
            console.log('SUCCESS: Query worked. Data:', data);
        }
    } catch (err) {
        console.error('EXCEPTION:', err);
    }
    console.log('--- DIAGNOSTIC END ---');
}

check();
