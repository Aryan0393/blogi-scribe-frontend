
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const createdAt = new Date(post.created_at);
  const updatedAt = new Date(post.updated_at);
  
  const isUpdated = updatedAt.getTime() > createdAt.getTime();
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden rounded-xl card-hover border-none">
      {post.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      
      <CardHeader className="pb-4 bg-gradient-to-br from-white to-gray-50">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-grow bg-white">
        <div className="line-clamp-3 text-gray-600">
          {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
          {post.content.length > 150 && '...'}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 text-sm text-gray-500 flex flex-col items-start space-y-1 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="font-medium text-primary">By {post.author}</div>
        <div className="flex space-x-2 text-gray-400">
          <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          {isUpdated && (
            <>
              <span>•</span>
              <span>Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
