
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import BlogForm from "@/components/BlogForm";
import { createPost } from "@/utils/api";
import { toast } from "@/components/ui/sonner";

const CreatePost: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleCreatePost = async (values: { title: string; content: string }) => {
    try {
      setIsSubmitting(true);
      const newPost = await createPost(values);
      toast.success("Post created successfully!");
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
        <BlogForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default CreatePost;
