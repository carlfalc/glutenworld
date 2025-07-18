import React, { useState } from 'react';
import { ArrowLeft, Users, MessageCircle, Calendar, Trophy, MapPin, Globe, Plus, User, Filter, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityPosts, useCommunityStats, useCommunityCategories, useLikePost } from '@/hooks/useCommunity';
import { CommunityPostCard } from '@/components/CommunityPostCard';
import { CreatePostModal } from '@/components/CreatePostModal';
import { UserProfileModal } from '@/components/UserProfileModal';

const GlutenWorld = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { data: communityStats } = useCommunityStats();
  const { data: categories = [] } = useCommunityCategories();
  const { data: posts = [] } = useCommunityPosts(selectedCategory || undefined);
  const likePost = useLikePost();

  const handleLikePost = async (postId: string) => {
    try {
      await likePost.mutateAsync(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const statsDisplay = [
    { label: 'Members', value: communityStats?.total_members?.toLocaleString() || '0', icon: Users },
    { label: 'Posts', value: communityStats?.total_posts?.toLocaleString() || '0', icon: MessageCircle },
    { label: 'Categories', value: communityStats?.total_categories?.toString() || '0', icon: Hash },
    { label: 'New This Week', value: communityStats?.new_members_this_week?.toString() || '0', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Gluten World</h1>
                <p className="text-sm text-primary-foreground/80">Global gluten-free community</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfile(true)}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowCreatePost(true)}
                    className="hidden sm:flex"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Post
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Welcome to Gluten World! 🌍</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Join thousands of people living gluten-free lives. Share experiences, discover recipes, 
              find support, and connect with others who understand your journey.
            </p>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statsDisplay.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-3 md:p-4">
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
                <div className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {/* Filter and Create Post */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>

            {/* Login prompt for non-users */}
            {!user && (
              <Card className="border-2 border-dashed border-primary/30">
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign in to share posts, connect with others, and be part of the conversation.
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Sign In to Participate
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {selectedCategory 
                        ? 'No posts in this category yet. Be the first to share!'
                        : 'Be the first to share with the community!'
                      }
                    </p>
                    {user && (
                      <Button onClick={() => setShowCreatePost(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        // Switch to feed tab
                        const feedTab = document.querySelector('[value="feed"]') as HTMLElement;
                        feedTab?.click();
                      }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Success Stories Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're building a dedicated space for community members to share their inspiring 
                  gluten-free success stories and journeys.
                </p>
                <p className="text-sm text-muted-foreground">
                  For now, feel free to share your stories in the community feed using the "Success Stories" category!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button for Mobile */}
      {user && (
        <Button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden z-50"
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Modals */}
      <CreatePostModal 
        isOpen={showCreatePost} 
        onClose={() => setShowCreatePost(false)} 
      />
      <UserProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </div>
  );
};

export default GlutenWorld;