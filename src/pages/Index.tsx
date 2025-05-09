
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { BlogPost, PaginatedResponse } from "@/types";
import { fetchAllPosts } from "@/utils/api";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 6;

const Index: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllPosts(page, POSTS_PER_PAGE, debouncedSearchQuery);
        
        if (Array.isArray(response)) {
          // Handle case where backend doesn't support pagination yet
          setPosts(response);
          setTotalPages(1);
        } else {
          // Handle paginated response
          setPosts(response.items || []);
          setTotalPages(response.pages || 1);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load posts");
        setPosts([]); // Ensure we clear posts on error
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page, debouncedSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already triggered by the debounced query
  };

  const getPageLinks = () => {
    const pageLinks = [];
    const maxDisplayPages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxDisplayPages / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);
    
    if (endPage - startPage + 1 < maxDisplayPages) {
      startPage = Math.max(1, endPage - maxDisplayPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={(e) => {
              e.preventDefault();
              setPage(i);
            }}
            className={page === i ? "bg-primary text-white" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageLinks;
  };

  return (
    <Layout>
      <div className="space-y-8 animated-bg">
        <div className="text-center py-10 fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-heading">Blogi</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">Discover the latest articles from our community of writers and thinkers</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="rounded-full">Search</Button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 staggered-fade-in">
            {Array(POSTS_PER_PAGE).fill(0).map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 staggered-fade-in">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 fade-in">
            <div className="bg-white p-10 rounded-xl shadow-sm max-w-lg mx-auto">
              <p className="text-xl text-gray-500 mb-4">
                {debouncedSearchQuery
                  ? `No posts found matching "${debouncedSearchQuery}". Try a different search term.`
                  : "No posts found. Be the first to create one!"}
              </p>
              {!debouncedSearchQuery && (
                <Button asChild>
                  <Link to="/create">Create First Post</Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-12 fade-in">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageLinks()}

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
};

export default Index;
