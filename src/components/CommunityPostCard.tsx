import { MessageCircle, Heart, User, Calendar, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommunityPost } from '@/hooks/useCommunity';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const CommunityPostCard = ({ post, onLike, onComment }: CommunityPostCardProps) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike(post.id);
  };

  return (
    <Card className="bg-card/50 border border-border/30 hover:border-border/60 transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">
                {post.profiles?.full_name || 'Community Member'}
              </span>
              {post.profiles?.location && (
                <span className="text-xs text-muted-foreground">
                  from {post.profiles.location}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              {post.community_categories && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5"
                  style={{ backgroundColor: `${post.community_categories.color}20` }}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {post.community_categories.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {post.title}
          </h3>
        )}

        {/* Content */}
        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Image */}
        {post.image_url && (
          <div className="rounded-lg overflow-hidden border border-border/20">
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}

        {/* Bio */}
        {post.profiles?.bio && (
          <div className="text-xs text-muted-foreground italic border-l-2 border-border/30 pl-3">
            "{post.profiles.bio}"
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`h-8 px-3 text-xs gap-2 hover:bg-red-500/10 ${
              liked ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {post.likes_count || 0}
          </Button>
          
          {onComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="h-8 px-3 text-xs gap-2 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments_count || 0}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};