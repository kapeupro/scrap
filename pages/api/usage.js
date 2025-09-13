import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Get user's plan
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
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const { count } = await supabaseAdmin
      .from('extractions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonth}-01`);
    
    res.status(200).json({
      plan: userPlan,
      limit: monthlyLimit,
      used: count || 0,
      remaining: Math.max(0, monthlyLimit - (count || 0)),
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch usage data',
      details: error.message 
    });
  }
}
