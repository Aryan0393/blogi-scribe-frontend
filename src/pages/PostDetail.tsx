
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { BlogPost } from "@/types";
import { fetchPostById, deletePost } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow, format } from "date-fns";
import { Edit, Trash } from "lucide-react";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchPostById(parseInt(id));
        setPost(data);
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load post");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id, navigate]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deletePost(parseInt(id));
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const isOwner = user?.id === post?.author_id;
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const createdAt = new Date(post.created_at);
  const updatedAt = new Date(post.updated_at);
  const isUpdated = updatedAt.getTime() > createdAt.getTime();
  
  return (
    <Layout>
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2 mb-6">
            <span className="font-medium">By {post.author}</span>
            <span>•</span>
            <span>
              Created on {format(createdAt, "MMM d, yyyy")}
            </span>
            {isUpdated && (
              <>
                <span>•</span>
                <span>
                  Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}
                </span>
              </>
            )}
          </div>
          
          {isAuthenticated && isOwner && (
            <div className="flex space-x-2">
              <Link to={`/edit/${post.id}`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center"
                    disabled={isDeleting}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      className="bg-destructive text-destructive-foreground"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </header>
        
        <div className="blog-content prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className="mt-10 pt-6 border-t">
          <Link to="/">
            <Button variant="outline">← Back to All Posts</Button>
          </Link>
        </div>
      </article>
    </Layout>
  );
};

export default PostDetail;
