import { searchPlaces } from '../../lib/places-api';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, location = '', maxResults = 20, minRating, priceLevel, openNow, radius } = req.body;
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
    
    // Get user's plan (default to starter)
    const { data: userData } = await supabaseAdmin
      .from('user_profiles')
      .select('plan_type')
      .eq('id', user.id)
      .single();
    
    const userPlan = userData?.plan_type || 'starter';
    
    // Define limits based on plan (weekly for free, monthly for paid)
    const limits = {
      starter: { weekly: 100, monthly: null }, // Free plan: 100/week
      pro: { weekly: null, monthly: 1000 },    // Pro plan: 1000/month
      agency: { weekly: null, monthly: 5000 }  // Agency plan: 5000/month
    };
    
    const planLimits = limits[userPlan] || limits.starter;
    
    // Check appropriate limit based on plan type
    if (userPlan === 'starter') {
      // Free plan: check weekly limit
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);
      
      const { count: weeklyCount } = await supabaseAdmin
        .from('extractions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', currentWeekStart.toISOString());
      
      if (weeklyCount >= planLimits.weekly) {
        return res.status(429).json({ 
          error: `Weekly limit reached (${planLimits.weekly} searches for free plan)`,
          used: weeklyCount,
          limit: planLimits.weekly,
          limitType: 'weekly',
          planType: userPlan,
          resetDate: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    } else {
      // Paid plans: check monthly limit
      const { count: monthlyCount } = await supabaseAdmin
        .from('extractions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', `${currentMonth}-01`);
      
      if (monthlyCount >= planLimits.monthly) {
        return res.status(429).json({ 
          error: `Monthly limit reached (${planLimits.monthly} searches for ${userPlan} plan)`,
          used: monthlyCount,
          limit: planLimits.monthly,
          limitType: 'monthly',
          planType: userPlan,
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }
    }

    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Perform places search using API
    console.log(`Starting places search for user ${user.id}: "${query}" in "${location}"`);
    const filters = { minRating, priceLevel, openNow, radius };
    const places = await searchPlaces(query.trim(), location.trim(), maxResults, filters);

    if (!places || places.length === 0) {
      return res.status(404).json({ error: 'No places found. Try a different search query or location.' });
    }

    // Save search to database
    console.log(`Saving search to DB for user ${user.id}: ${query} in ${location}`);
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
    } else {
      console.log('Search saved successfully:', search?.id);
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
