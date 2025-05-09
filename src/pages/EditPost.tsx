
import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import BlogForm from "@/components/BlogForm";
import { fetchPostById, updatePost } from "@/utils/api";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const postData = await fetchPostById(parseInt(id));
        setPost({ title: postData.title, content: postData.content });
        
        // Check if the current user is the owner of the post
        setIsOwner(user?.id === postData.author_id);
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load post");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [id, user?.id, navigate]);
  
  const handleUpdatePost = async (values: { title: string; content: string }) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updatePost(parseInt(id), values);
      toast.success("Post updated successfully!");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Layout>
    );
  }
  
  if (!isOwner) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Not Authorized</h1>
          <p className="text-gray-600">You don't have permission to edit this post.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
        {post && (
          <BlogForm 
            initialValues={post} 
            onSubmit={handleUpdatePost} 
            isSubmitting={isSubmitting} 
          />
        )}
      </div>
    </Layout>
  );
};

export default EditPost;
