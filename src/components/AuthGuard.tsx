import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'tourist' | 'authority';
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (requiredRole && profile?.user_type !== requiredRole) {
        // Redirect to appropriate dashboard if user has wrong role
        const targetRoute = profile?.user_type === 'tourist' ? '/tourist-dashboard' : '/authority-dashboard';
        navigate(targetRoute, { replace: true });
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && profile?.user_type !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;