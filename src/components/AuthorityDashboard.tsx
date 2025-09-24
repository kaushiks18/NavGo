import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  LogOut, 
  Eye, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Monitor,
  Activity,
  Map,
  UserCheck,
  Navigation,
  Zap,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration
const mockTourists = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    country: 'United States',
    passportStatus: 'verified',
    ticketStatus: 'verified',
    registrationDate: '2024-01-15',
    verificationDate: '2024-01-16',
    location: { lat: 28.6139, lng: 77.2090, city: 'New Delhi' },  // Mock location
    lastActive: '2024-01-25T10:30:00Z',
    safetyStatus: 'safe'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    country: 'Spain',
    passportStatus: 'uploaded',
    ticketStatus: 'uploaded',
    registrationDate: '2024-01-18',
    verificationDate: null,
    location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
    lastActive: '2024-01-25T09:15:00Z',
    safetyStatus: 'safe'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david.chen@email.com',
    country: 'Canada',
    passportStatus: 'verified',
    ticketStatus: 'pending',
    registrationDate: '2024-01-20',
    verificationDate: null,
    location: { lat: 15.2993, lng: 74.1240, city: 'Goa' },
    lastActive: '2024-01-25T11:45:00Z',
    safetyStatus: 'warning'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    country: 'Australia',
    passportStatus: 'uploaded',
    ticketStatus: 'verified',
    registrationDate: '2024-01-22',
    verificationDate: null,
    location: { lat: 26.9124, lng: 75.7873, city: 'Jaipur' },
    lastActive: '2024-01-25T08:20:00Z',
    safetyStatus: 'safe'
  }
];

const mockAlerts = [
  { id: '1', tourist: 'David Chen', message: 'Tourist reported minor injury', severity: 'medium', time: '30 mins ago' },
  { id: '2', tourist: 'Maria Garcia', message: 'Document verification pending', severity: 'low', time: '2 hours ago' },
  { id: '3', tourist: 'John Smith', message: 'Check-in at hotel confirmed', severity: 'info', time: '4 hours ago' }
];

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredTourists = mockTourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatus === 'all') return matchesSearch;
    if (selectedStatus === 'pending') return matchesSearch && (tourist.passportStatus === 'uploaded' || tourist.ticketStatus === 'uploaded');
    if (selectedStatus === 'verified') return matchesSearch && tourist.passportStatus === 'verified' && tourist.ticketStatus === 'verified';
    return matchesSearch;
  });

  const getOverallStatus = (passportStatus: string, ticketStatus: string) => {
    if (passportStatus === 'verified' && ticketStatus === 'verified') return 'verified';
    if (passportStatus === 'uploaded' || ticketStatus === 'uploaded') return 'review';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'uploaded': case 'review': return <Clock className="h-4 w-4 text-accent" />;
      default: return <X className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'review': return <Badge variant="secondary">Under Review</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const stats = {
    total: mockTourists.length,
    verified: mockTourists.filter(t => getOverallStatus(t.passportStatus, t.ticketStatus) === 'verified').length,
    pending: mockTourists.filter(t => getOverallStatus(t.passportStatus, t.ticketStatus) === 'review').length,
    online: mockTourists.filter(t => {
      const lastActive = new Date(t.lastActive);
      const timeDiff = currentTime.getTime() - lastActive.getTime();
      return timeDiff < 30 * 60 * 1000; // Active within last 30 minutes
    }).length,
    alerts: mockAlerts.filter(alert => alert.severity === 'medium' || alert.severity === 'high').length
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getSafetyStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-accent';
      case 'danger': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Authority Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage tourist safety • {currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1 bg-success/10 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">System Active</span>
              </div>
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
            <Monitor className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('map')}
            className="h-9"
          >
            <Map className="h-4 w-4 mr-2" />
            Live Map
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
            variant={activeTab === 'safety' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('safety')}
            className="h-9"
          >
            <Shield className="h-4 w-4 mr-2" />
            Safety Monitor
          </Button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Currently Online</CardTitle>
                  <Activity className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{stats.online}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{stats.verified}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.pending}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-destructive/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.alerts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity & Alerts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Live Tourist Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-accent" />
                    Live Tourist Activity
                  </CardTitle>
                  <CardDescription>Real-time tourist locations and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTourists.slice(0, 4).map((tourist) => {
                      const lastActive = new Date(tourist.lastActive);
                      const timeDiff = currentTime.getTime() - lastActive.getTime();
                      const isOnline = timeDiff < 30 * 60 * 1000;
                      
                      return (
                        <div key={tourist.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
                            <div>
                              <p className="font-medium text-foreground">{tourist.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {tourist.location.city}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={isOnline ? 'default' : 'outline'} className="text-xs">
                              {isOnline ? 'Online' : 'Offline'}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.floor(timeDiff / (1000 * 60))}m ago
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Alerts */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Safety Alerts
                  </CardTitle>
                  <CardDescription>Recent alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/20">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'high' ? 'bg-destructive' :
                          alert.severity === 'medium' ? 'bg-accent' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{alert.tourist}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' :
                          alert.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-primary" />
                  Live Tourist Tracking Map
                </CardTitle>
                <CardDescription>Real-time locations of all registered tourists</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Map Placeholder - In a real app, this would be an interactive map */}
                <div className="h-96 bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <div className="text-center z-10">
                    <Map className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground mb-4">Real-time tourist location tracking</p>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      {mockTourists.map((tourist) => (
                        <div key={tourist.id} className="bg-card p-3 rounded-lg border">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getSafetyStatusColor(tourist.safetyStatus)}`}></div>
                            <span className="text-sm font-medium">{tourist.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{tourist.location.city}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Controls */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Safe Locations</h4>
                      <p className="text-sm text-success">All tourists accounted for</p>
                    </div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Caution Areas</h4>
                      <p className="text-sm text-accent">1 tourist needs attention</p>
                    </div>
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Emergency Zones</h4>
                      <p className="text-sm text-muted-foreground">No active emergencies</p>
                    </div>
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <>
            {/* Filters and Search */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>Review and manage tourist document submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedStatus === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={selectedStatus === 'verified' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('verified')}
                    >
                      Verified
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Filters and Search */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Tourist Registrations</CardTitle>
            <CardDescription>Review and manage tourist document submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={selectedStatus === 'verified' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('verified')}
                >
                  Verified
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Tourist List */}
            <div className="space-y-4">
              {filteredTourists.map((tourist) => (
                <Card key={tourist.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{tourist.name}</h3>
                            <p className="text-muted-foreground">{tourist.email}</p>
                            <p className="text-sm text-muted-foreground">From {tourist.country}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(tourist.passportStatus)}
                            <span className="text-sm">Passport</span>
                            <Badge variant={tourist.passportStatus === 'verified' ? 'default' : tourist.passportStatus === 'uploaded' ? 'secondary' : 'outline'}>
                              {tourist.passportStatus === 'verified' ? 'Verified' : tourist.passportStatus === 'uploaded' ? 'Review' : 'Pending'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(tourist.ticketStatus)}
                            <span className="text-sm">Ticket</span>
                            <Badge variant={tourist.ticketStatus === 'verified' ? 'default' : tourist.ticketStatus === 'uploaded' ? 'secondary' : 'outline'}>
                              {tourist.ticketStatus === 'verified' ? 'Verified' : tourist.ticketStatus === 'uploaded' ? 'Review' : 'Pending'}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            Registered: {new Date(tourist.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(getOverallStatus(tourist.passportStatus, tourist.ticketStatus))}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-6">
            {/* Safety Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-success">
                    <UserCheck className="h-5 w-5 mr-2" />
                    Safe Tourists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success mb-2">
                    {mockTourists.filter(t => t.safetyStatus === 'safe').length}
                  </div>
                  <p className="text-sm text-muted-foreground">All clear, no issues reported</p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-accent">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Need Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {mockTourists.filter(t => t.safetyStatus === 'warning').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Requires monitoring</p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive mb-2">0</div>
                  <p className="text-sm text-muted-foreground">No active emergencies</p>
                </CardContent>
              </Card>
            </div>

            {/* Safety Monitoring Tools */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Safety Monitoring Tools
                </CardTitle>
                <CardDescription>Manage tourist safety and emergency response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Tourist Status Monitor</h4>
                    {mockTourists.map((tourist) => (
                      <div key={tourist.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getSafetyStatusColor(tourist.safetyStatus)} bg-current`}></div>
                          <div>
                            <p className="font-medium text-foreground">{tourist.name}</p>
                            <p className="text-sm text-muted-foreground">{tourist.location.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={tourist.safetyStatus === 'safe' ? 'default' : tourist.safetyStatus === 'warning' ? 'secondary' : 'destructive'}>
                            {tourist.safetyStatus}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Emergency Response</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Emergency Services
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Send Safety Alert
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Navigation className="h-4 w-4 mr-2" />
                        Track Tourist Location
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Generate Safety Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;