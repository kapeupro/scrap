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

    // Get user's plan (default to starter)
    const { data: userData } = await supabaseAdmin
      .from('user_profiles')
      .select('plan_type, created_at')
      .eq('id', user.id)
      .single();
    
    const userPlan = userData?.plan_type || 'starter';
    const isFreePlan = userPlan === 'starter';
    
    // Define limits based on plan (weekly for free, monthly for paid)
    const limits = {
      starter: { weekly: 100, monthly: null },
      pro: { weekly: null, monthly: 1000 },
      agency: { weekly: null, monthly: 5000 }
    };
    
    const planLimits = limits[userPlan] || limits.starter;
    
    let current = 0;
    let limit = 0;
    let resetDate = null;
    let limitType = '';

    if (isFreePlan) {
      // Free plan: weekly limits
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);
      
      console.log(`Checking weekly usage for user ${user.id} from ${currentWeekStart.toISOString()}`);
      
      const { count: weeklyCount, error: countError } = await supabaseAdmin
        .from('extractions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'maps')
        .gte('created_at', currentWeekStart.toISOString());
      
      if (countError) {
        console.error('Error counting weekly searches:', countError);
      }
      
      console.log(`Weekly count for user ${user.id}: ${weeklyCount}`);
      
      current = weeklyCount || 0;
      limit = planLimits.weekly;
      limitType = 'weekly';
      resetDate = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      // Paid plans: monthly limits
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const { count: monthlyCount } = await supabaseAdmin
        .from('extractions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'maps')
        .gte('created_at', `${currentMonth}-01`);
      
      current = monthlyCount || 0;
      limit = planLimits.monthly;
      limitType = 'monthly';
      resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
    }

    res.status(200).json({
      current,
      limit,
      limitType,
      planType: userPlan,
      isFreePlan,
      resetDate,
      planFeatures: {
        starter: {
          name: 'Gratuit',
          searches: '100 recherches/semaine',
          features: ['Export CSV & JSON', 'Support communauté', 'Données de base']
        },
        pro: {
          name: 'Pro',
          price: '29€/mois',
          searches: '1,000 recherches/mois',
          features: ['Export CSV & JSON', 'Support prioritaire', 'Données enrichies', 'API access']
        },
        agency: {
          name: 'Agency',
          price: '99€/mois',
          searches: '5,000 recherches/mois',
          features: ['Export CSV & JSON', 'Support dédié', 'Données complètes', 'API illimitée', 'White-label']
        }
      }
    });

  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get usage stats',
      details: error.message 
    });
  }
}
