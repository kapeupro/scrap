-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid NOT NULL,
  plan_type character varying DEFAULT 'starter'::character varying CHECK (plan_type::text = ANY (ARRAY['starter'::character varying, 'pro'::character varying, 'agency'::character varying]::text[])),
  stripe_customer_id character varying,
  stripe_subscription_id character varying,
  subscription_status character varying DEFAULT 'trial'::character varying CHECK (subscription_status::text = ANY (ARRAY['trial'::character varying, 'active'::character varying, 'canceled'::character varying, 'past_due'::character varying]::text[])),
  trial_ends_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Create extractions table
CREATE TABLE IF NOT EXISTS public.extractions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  linkedin_url text,
  profiles jsonb NOT NULL DEFAULT '[]'::jsonb,
  profiles_count integer DEFAULT 0,
  emails_found integer DEFAULT 0,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying]::text[])),
  enriched_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  -- Additional fields for maps search
  type TEXT DEFAULT 'linkedin' CHECK (type IN ('maps', 'linkedin')),
  query TEXT,
  location TEXT,
  results_count INTEGER DEFAULT 0,
  data JSONB,
  CONSTRAINT extractions_pkey PRIMARY KEY (id),
  CONSTRAINT extractions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month_year character varying NOT NULL,
  extractions_used integer DEFAULT 0,
  emails_used integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT usage_tracking_pkey PRIMARY KEY (id),
  CONSTRAINT usage_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for extractions table
CREATE POLICY "Users can view own extractions" ON public.extractions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own extractions" ON public.extractions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own extractions" ON public.extractions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own extractions" ON public.extractions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for usage_tracking table
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_extractions_user_id ON public.extractions(user_id);
CREATE INDEX IF NOT EXISTS idx_extractions_created_at ON public.extractions(created_at);
CREATE INDEX IF NOT EXISTS idx_extractions_type ON public.extractions(type);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_month_year ON public.usage_tracking(month_year);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
