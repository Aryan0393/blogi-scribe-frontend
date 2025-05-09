
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/types";
import { fetchAllPosts } from "@/utils/api";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Index: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Recent Posts</h1>
          <p className="text-gray-600 text-lg">Discover the latest articles from our community</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No posts found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
