import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [userType, setUserType] = useState<'tourist' | 'authority' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const navigate = useNavigate();
  const { user, profile, loading, signUp, signIn } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && profile) {
      const targetRoute = profile.user_type === 'tourist' ? '/tourist-dashboard' : '/authority-dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) return;

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        console.error('Login error:', error);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      const { error } = await signUp(formData.email, formData.password, userType, formData.displayName);
      if (error) {
        console.error('Signup error:', error);
      }
    }
  };

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

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Tourist Safety Portal</h1>
            <p className="text-muted-foreground">Choose your access type</p>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-primary"
              onClick={() => setUserType('tourist')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Tourist Login</CardTitle>
                <CardDescription>
                  Register and upload your travel documents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-primary"
              onClick={() => setUserType('authority')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Authority Login</CardTitle>
                <CardDescription>
                  Review and verify tourist registrations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            {userType === 'tourist' ? <User className="h-8 w-8 text-white" /> : <UserCheck className="h-8 w-8 text-white" />}
          </div>
          <CardTitle className="text-2xl">
            {userType === 'tourist' ? 'Tourist Access' : 'Authority Access'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Enter your credentials to access the portal' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 space-x-1 bg-secondary rounded-lg p-1">
            <Button
              type="button"
              variant={isLogin ? "secondary" : "ghost"}
              className="w-full text-sm"
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "secondary" : "ghost"}
              className="w-full text-sm"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          <div className="flex justify-between mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setUserType(null)}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              Back
            </Button>
            {isLogin && (
              <Button 
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                Forgot Password?
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;