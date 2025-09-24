import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Tourist Safety Portal</h1>
                <p className="text-sm text-muted-foreground">Government of India</p>
              </div>
            </div>
            <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300">
              Access Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Ensuring Safe Travel
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> for Everyone</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive safety management system for international tourists visiting India. 
              Register your documents, get verified, and travel with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-elegant transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Securely upload your passport and flight tickets for verification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Authority Review</CardTitle>
                <CardDescription>
                  Our trained authorities review and verify your documents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Safe Travel</CardTitle>
                <CardDescription>
                  Get verified status and enjoy safe, worry-free travel in India
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Tourist Safety Portal - Government of India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;