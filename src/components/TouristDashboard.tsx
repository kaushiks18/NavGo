import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  Plane, 
  CheckCircle, 
  Clock, 
  X, 
  LogOut, 
  AlertTriangle, 
  Star, 
  MapPin, 
  Bell, 
  User, 
  History,
  Shield,
  Award,
  Calendar,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration
const mockTravelHistory = [
  {
    id: '1',
    destination: 'Mumbai, Maharashtra',
    visitDate: '2024-01-15',
    duration: '3 days',
    rating: 4.5,
    status: 'completed'
  },
  {
    id: '2', 
    destination: 'Goa',
    visitDate: '2024-02-20',
    duration: '5 days',
    rating: 5.0,
    status: 'completed'
  },
  {
    id: '3',
    destination: 'Delhi',
    visitDate: '2024-03-10',
    duration: '2 days', 
    rating: 4.0,
    status: 'completed'
  }
];

const mockNotifications = [
  { id: '1', message: 'Your passport verification is complete', time: '2 hours ago', type: 'success' },
  { id: '2', message: 'Welcome to India! Safe travels.', time: '1 day ago', type: 'info' },
  { id: '3', message: 'Remember to check local COVID guidelines', time: '2 days ago', type: 'warning' }
];

const TouristDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [documents, setDocuments] = useState({
    passport: null as File | null,
    flightTicket: null as File | null
  });
  const [uploadStatus, setUploadStatus] = useState({
    passport: 'verified' as 'pending' | 'uploaded' | 'verified',
    flightTicket: 'verified' as 'pending' | 'uploaded' | 'verified'
  });
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock tourist score (out of 10)
  const touristScore = 8.5;
  const totalTrips = mockTravelHistory.length;
  const averageRating = mockTravelHistory.reduce((acc, trip) => acc + trip.rating, 0) / totalTrips;

  const handleFileUpload = (type: 'passport' | 'flightTicket', file: File) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    setUploadStatus(prev => ({ ...prev, [type]: 'uploaded' }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'uploaded': return <Clock className="h-4 w-4 text-accent" />;
      default: return <X className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'uploaded': return 'Under Review';
      default: return 'Pending Upload';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'uploaded': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSOSCall = () => {
    // In a real app, this would trigger emergency services
    alert('SOS Alert sent! Emergency services will be notified.');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tourist Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.display_name || 'Traveler'}!</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* SOS Emergency Button */}
              <Button 
                variant="destructive" 
                onClick={handleSOSCall}
                className="bg-destructive hover:bg-destructive/90 font-semibold"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                SOS
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg w-fit">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="h-9"
          >
            <User className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('documents')}
            className="h-9"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="h-9"
          >
            <History className="h-4 w-4 mr-2" />
            Travel History
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Score */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tourist Score Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-accent" />
                    Tourist Score
                  </CardTitle>
                  <CardDescription>Your travel reputation in India</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{touristScore}/10</div>
                    <Progress value={touristScore * 10} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">Excellent Traveler</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{totalTrips}</div>
                      <p className="text-sm text-muted-foreground">Total Trips</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground">{profile?.display_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{profile?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <Badge variant="secondary">{profile?.user_type || 'Tourist'}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-success" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadStatus.passport)}
                      <span className="font-medium">Passport</span>
                    </div>
                    <Badge variant={getStatusVariant(uploadStatus.passport)}>
                      {getStatusText(uploadStatus.passport)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadStatus.flightTicket)}
                      <span className="font-medium">Flight Ticket</span>
                    </div>
                    <Badge variant={getStatusVariant(uploadStatus.flightTicket)}>
                      {getStatusText(uploadStatus.flightTicket)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Recent Activity & Notifications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Travels */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Recent Travels in India
                  </CardTitle>
                  <CardDescription>Your travel history and experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTravelHistory.slice(0, 3).map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-foreground">{trip.destination}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(trip.visitDate).toLocaleDateString()}
                              </span>
                              <span>{trip.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-accent fill-current" />
                            <span className="ml-1 text-sm font-medium">{trip.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-success border-success">
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4" onClick={() => setActiveTab('history')}>
                    View All Travel History →
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-accent" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/20">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-success' :
                          notification.type === 'warning' ? 'bg-accent' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="shadow-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <Phone className="h-5 w-5 mr-2" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>Important numbers for your safety</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium text-foreground">Police</h4>
                      <p className="text-sm text-muted-foreground">100</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium text-foreground">Medical Emergency</h4>
                      <p className="text-sm text-muted-foreground">108</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium text-foreground">Tourist Helpline</h4>
                      <p className="text-sm text-muted-foreground">1363</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium text-foreground">Fire Department</h4>
                      <p className="text-sm text-muted-foreground">101</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Status Overview */}
            <div className="lg:col-span-1">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadStatus.passport)}
                      <span className="font-medium">Passport</span>
                    </div>
                    <Badge variant={getStatusVariant(uploadStatus.passport)}>
                      {getStatusText(uploadStatus.passport)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadStatus.flightTicket)}
                      <span className="font-medium">Flight Ticket</span>
                    </div>
                    <Badge variant={getStatusVariant(uploadStatus.flightTicket)}>
                      {getStatusText(uploadStatus.flightTicket)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Upload */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Passport Upload */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Passport Document
                    </CardTitle>
                    <CardDescription>
                      Upload a clear photo or scan of your passport's main page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {documents.passport ? documents.passport.name : 'Click to upload or drag and drop'}
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('passport', file);
                        }}
                        className="hidden"
                        id="passport-upload"
                      />
                      <Label htmlFor="passport-upload">
                        <Button variant="outline" className="cursor-pointer">
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Flight Ticket Upload */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-primary" />
                      Flight Ticket
                    </CardTitle>
                    <CardDescription>
                      Upload your flight booking confirmation or e-ticket
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {documents.flightTicket ? documents.flightTicket.name : 'Click to upload or drag and drop'}
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('flightTicket', file);
                        }}
                        className="hidden"
                        id="ticket-upload"
                      />
                      <Label htmlFor="ticket-upload">
                        <Button variant="outline" className="cursor-pointer">
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                    disabled={!documents.passport || !documents.flightTicket}
                  >
                    Submit for Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-primary" />
                  Complete Travel History
                </CardTitle>
                <CardDescription>All your travels and experiences in India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTravelHistory.map((trip) => (
                    <Card key={trip.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg text-foreground">{trip.destination}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(trip.visitDate).toLocaleDateString()}
                              </span>
                              <span>Duration: {trip.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(trip.rating) 
                                      ? 'text-accent fill-current' 
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{trip.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-success border-success">
                              {trip.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristDashboard;