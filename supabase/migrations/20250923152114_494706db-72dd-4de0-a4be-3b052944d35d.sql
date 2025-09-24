-- Fix infinite recursion in RLS policies
-- First drop the problematic policy
DROP POLICY IF EXISTS "Authorities can view tourist profiles" ON public.profiles;

-- Create a security definer function to check user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS TEXT AS $$
  SELECT user_type FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create the corrected policy using the security definer function
CREATE POLICY "Authorities can view tourist profiles" 
ON public.profiles 
FOR SELECT 
USING (
  public.get_current_user_type() = 'authority' 
  AND user_type = 'tourist'
);