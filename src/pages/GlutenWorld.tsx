
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, MessageCircle, Heart, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';

const GlutenWorld = () => {
  const navigate = useNavigate();

  const communityStats = [
    { label: 'Active Members', value: '12,847', icon: Users },
    { label: 'Countries', value: '89', icon: Globe },
    { label: 'Recipes Shared', value: '45,692', icon: MessageCircle },
    { label: 'Lives Changed', value: '100K+', icon: Heart },
  ];

  const featuredCommunities = [
    {
      name: 'Gluten-Free Bakers United',
      members: '3,247',
      country: 'United States',
      description: 'Sharing the best gluten-free baking tips and recipes',
      isActive: true
    },
    {
      name: 'European Celiac Support',
      members: '2,891',
      country: 'Germany',
      description: 'Supporting celiac community across Europe',
      isActive: true
    },
    {
      name: 'Asian GF Recipe Exchange',
      members: '1,654',
      country: 'Japan',
      description: 'Traditional Asian recipes made gluten-free',
      isActive: false
    },
    {
      name: 'Canadian Wheat Warriors',
      members: '2,103',
      country: 'Canada',
      description: 'Fighting the good fight against gluten, eh!',
      isActive: true
    },
  ];

  const upcomingEvents = [
    {
      title: 'Global Gluten-Free Day',
      date: 'June 15, 2024',
      participants: '50K+',
      location: 'Worldwide'
    },
    {
      title: 'Virtual Cooking Masterclass',
      date: 'June 22, 2024',
      participants: '2K',
      location: 'Online'
    },
    {
      title: 'European GF Food Festival',
      date: 'July 8, 2024',
      participants: '15K',
      location: 'Berlin, Germany'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to <span className="text-gluten-primary">Gluten World</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow gluten-free enthusiasts from around the globe. Share recipes, 
            stories, and support each other on this journey.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-gluten-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {featuredCommunities.map((community, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{community.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {community.members} members
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {community.country}
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${community.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{community.description}</p>
                    <Button size="sm" className="w-full">
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants} participants
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        Join Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gluten-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Success Stories Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're collecting inspiring stories from our community members. 
                Check back soon to read about their gluten-free journeys!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlutenWorld;
