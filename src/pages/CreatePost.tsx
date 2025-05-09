
import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import BlogForm from "@/components/BlogForm";
import { createPost } from "@/utils/api";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";

const CreatePost: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleCreatePost = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const newPost = await createPost(formData);
      toast.success("Post created successfully!");
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto fade-in">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to all posts
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 gradient-heading">Create New Post</h1>
          <BlogForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
