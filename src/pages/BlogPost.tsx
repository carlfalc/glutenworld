import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts';
import FreeTrialButton from '@/components/FreeTrialButton';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "The article link has been copied to your clipboard.",
        });
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
              {post.featured && (
                <Badge className="bg-gluten-primary text-white">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            {/* Strategic Free Trial CTA */}
            <div className="bg-gradient-to-r from-gluten-primary/10 to-gluten-secondary/10 p-6 rounded-lg border border-gluten-primary/20 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Never Get Glutened Again</h3>
                <p className="text-muted-foreground mb-4">Join 500,000+ people protecting themselves with our scanner</p>
                <FreeTrialButton size="lg" className="px-8 py-3">
                  Start Free 5-Day Trial
                </FreeTrialButton>
                <p className="text-xs text-muted-foreground mt-2">No credit card required • Cancel anytime</p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .split('\n')
                .map((line, index, array) => {
                  // Handle anchor links
                  if (line.startsWith('<a id=')) {
                    return line;
                  }
                  // Handle horizontal rules
                  if (line.trim() === '---') {
                    return '<hr class="my-8 border-border">';
                  }
                  // Handle headers with improved styling
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-4xl font-bold mt-12 mb-6 text-foreground">${line.slice(2)}</h1>`;
                  } else if (line.startsWith('## ')) {
                    return `<h2 class="text-3xl font-bold mt-10 mb-5 text-foreground">${line.slice(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3 class="text-2xl font-bold mt-8 mb-4 text-foreground">${line.slice(4)}</h3>`;
                  }
                  // Handle blockquotes for testimonials
                  else if (line.startsWith('> ')) {
                    return `<blockquote class="border-l-4 border-primary bg-muted/30 p-4 my-6 italic">${line.slice(2)}</blockquote>`;
                  }
                  // Handle metadata lines (italic with asterisks)
                  else if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
                    return `<p class="text-muted-foreground text-sm italic mb-6 border-b border-border pb-4">${line.slice(1, -1)}</p>`;
                  }
                  // Handle bold callouts
                  else if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="text-lg font-bold text-primary bg-primary/5 p-4 rounded-lg my-6">${line.slice(2, -2)}</p>`;
                  }
                  // Handle numbered lists with better styling
                  else if (/^\d+\.\s\*\*/.test(line)) {
                    const match = line.match(/^(\d+)\.\s\*\*(.*?)\*\*\s-\s(.+)/);
                    if (match) {
                      return `<div class="mb-3 p-3 bg-muted/20 rounded-lg"><strong class="text-primary">${match[1]}. ${match[2]}</strong> - ${match[3]}</div>`;
                    }
                    return `<p class="mb-3">${line}</p>`;
                  }
                  // Handle bullet points with bold items
                  else if (line.startsWith('- **') && line.includes('**')) {
                    const match = line.match(/- \*\*(.*?)\*\*\s?-?\s?(.+)/);
                    if (match) {
                      return `<li class="mb-3 p-2 bg-muted/10 rounded"><strong class="text-primary">${match[1]}</strong>${match[2] ? ' - ' + match[2] : ''}</li>`;
                    }
                    return `<li class="mb-2">${line.slice(2)}</li>`;
                  }
                  // Handle regular bullet points
                  else if (line.startsWith('- ')) {
                    return `<li class="mb-2">${line.slice(2)}</li>`;
                  }
                  // Handle FAQ questions (bold Q:)
                  else if (line.startsWith('**Q:')) {
                    return `<h4 class="text-lg font-bold text-primary mt-6 mb-2">${line.replace(/\*\*/g, '')}</h4>`;
                  }
                  // Handle FAQ answers (A:)
                  else if (line.startsWith('A:')) {
                    return `<p class="mb-4 pl-4 border-l-2 border-primary/30 bg-muted/20 p-3 rounded-r-lg">${line.slice(2).trim()}</p>`;
                  }
                  // Handle empty lines
                  else if (line.trim() === '') {
                    return '';
                  }
                  // Handle regular paragraphs with improved formatting
                  else {
                    // Replace **bold** text
                    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
                    // Replace *italic* text
                    formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    // Handle links
                    formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline">$1</a>');
                    
                    return `<p class="mb-4 leading-relaxed text-foreground">${formattedLine}</p>`;
                  }
                })
                .filter(html => html.trim() !== '')
                .join('')
            }}
          />
          
          {/* Strategic Free Trial CTAs throughout content */}
          <div className="mt-12 space-y-8">
            <div className="bg-gradient-to-r from-gluten-primary/5 to-gluten-secondary/5 p-6 rounded-xl border border-gluten-primary/10 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Ready to Protect Yourself?</h3>
              <p className="text-muted-foreground mb-4">Start scanning products immediately with our free trial</p>
              <FreeTrialButton size="lg" className="px-8 py-3">
                Get Free Trial Now
              </FreeTrialButton>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Don't risk another exposure</h4>
                  <p className="text-sm text-muted-foreground">99.7% accuracy • Works offline • Updated daily</p>
                </div>
                <FreeTrialButton variant="outline" className="shrink-0">
                  Try Scanner Free
                </FreeTrialButton>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPost;