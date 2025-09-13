import { searchPlaces } from '../../lib/places-api';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, location = '', maxResults = 20 } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Check user's usage limits
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Get user's plan (default to free)
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();
    
    const userPlan = userData?.plan || 'free';
    
    // Define limits based on plan
    const limits = {
      free: 100,
      pro: 1000,
      business: 5000
    };
    
    const monthlyLimit = limits[userPlan] || 100;
    
    // Count searches this month
    const { count } = await supabaseAdmin
      .from('extractions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonth}-01`);
    
    if (count >= monthlyLimit) {
      return res.status(429).json({ 
        error: `Monthly limit reached (${monthlyLimit} searches for ${userPlan} plan)`,
        used: count,
        limit: monthlyLimit,
        monthlyLimit,
        planType: userPlan
      });
    }

    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Perform places search using API
    console.log(`Starting places search for user ${user.id}: "${query}" in "${location}"`);
    const places = await searchPlaces(query.trim(), location.trim(), maxResults);

    if (!places || places.length === 0) {
      return res.status(404).json({ error: 'No places found. Try a different search query or location.' });
    }

    // Save search to database
    const { data: search, error: saveError } = await supabaseAdmin
      .from('extractions')
      .insert({
        user_id: user.id,
        type: 'maps',
        query: query.trim(),
        location: location.trim(),
        results_count: places.length,
        data: places
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving search:', saveError);
    }

    // Return results
    res.status(200).json({
      id: search?.id,
      query: query.trim(),
      location: location.trim(),
      places,
      created_at: search?.created_at || new Date().toISOString()
    });

  } catch (error) {
    console.error('Maps search error:', error);
    res.status(500).json({ 
      error: 'Failed to search places',
      details: error.message 
    });
  }
}
