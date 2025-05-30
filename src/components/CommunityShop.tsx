
import { Store, Star, Users, Clock, MessageCircle, Heart, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCommunityPosts, useCreatePost, useLikePost } from '@/hooks/useCommunity';
import { useShopItems } from '@/hooks/useShop';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CommunityShop = () => {
  const { user } = useAuth();
  const { data: communityPosts = [], isLoading: postsLoading } = useCommunityPosts();
  const { data: shopItems = [], isLoading: shopLoading } = useShopItems();
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleCreatePost = async () => {
    if (newPostContent.trim() && user) {
      try {
        await createPostMutation.mutateAsync(newPostContent.trim());
        setNewPostContent('');
        setShowNewPostForm(false);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    if (user) {
      try {
        await likePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 h-8">
          <TabsTrigger value="community" className="text-xs px-2">Community</TabsTrigger>
          <TabsTrigger value="shop" className="text-xs px-2">Shop</TabsTrigger>
        </TabsList>
        
        <TabsContent value="community" className="space-y-3 mt-0">
          <div className="pb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-gluten-primary" />
              Community Feed
            </h3>
            {user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="h-6 px-2"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>

          {showNewPostForm && user && (
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-3 space-y-2">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share something with the community..."
                  className="w-full text-xs bg-transparent border-0 resize-none focus:outline-none placeholder:text-muted-foreground"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setShowNewPostForm(false)} className="h-6 px-2 text-xs">
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                    className="h-6 px-2 text-xs"
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-3">
            {postsLoading ? (
              <div className="text-xs text-muted-foreground text-center py-4">Loading posts...</div>
            ) : communityPosts.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">No posts yet. Be the first to share!</div>
            ) : (
              communityPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">Anonymous User</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-1 hover:text-red-400 transition-colors"
                          disabled={!user || likePostMutation.isPending}
                        >
                          <Heart className="w-3 h-3" />
                          <span>{post.likes_count}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="shop" className="space-y-3 mt-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Store className="w-4 h-4 text-gluten-primary" />
              Featured Products
            </h3>
          </div>
          
          <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-3">
            {shopLoading ? (
              <div className="text-xs text-muted-foreground text-center py-4">Loading products...</div>
            ) : shopItems.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">No products available yet.</div>
            ) : (
              shopItems.map((item) => (
                <Card 
                  key={item.id}
                  className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                        <Store className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">by Seller</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">{item.rating || 0}</span>
                          </div>
                          <span className="text-sm font-semibold text-gluten-primary">${item.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityShop;
