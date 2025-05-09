import { LoginCredentials, RegisterCredentials, BlogPost, PaginatedResponse } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://localhost:8000/api"; // Replace with your actual API URL

// Mock data for development
const MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React",
    content: "React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible...",
    author: "John Doe",
    author_id: 1,
    created_at: "2025-05-07T10:00:00Z",
    updated_at: "2025-05-07T10:00:00Z",
    image_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Mastering TypeScript",
    content: "TypeScript is a strongly typed programming language that builds on JavaScript...",
    author: "Jane Smith",
    author_id: 2,
    created_at: "2025-05-08T14:30:00Z",
    updated_at: "2025-05-08T16:45:00Z",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Power of Tailwind CSS",
    content: "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design...",
    author: "Alex Johnson",
    author_id: 3,
    created_at: "2025-05-09T09:15:00Z",
    updated_at: "2025-05-09T09:15:00Z",
    image_url: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Building APIs with FastAPI",
    content: "FastAPI is a modern, fast web framework for building APIs with Python...",
    author: "Maria Garcia",
    author_id: 1,
    created_at: "2025-05-05T11:20:00Z",
    updated_at: "2025-05-06T13:40:00Z"
  },
  {
    id: 5,
    title: "State Management in React",
    content: "Managing state is one of the hardest parts of any application. Here's how to do it effectively in React...",
    author: "John Doe",
    author_id: 1,
    created_at: "2025-05-04T16:30:00Z",
    updated_at: "2025-05-04T16:30:00Z",
    image_url: "https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Responsive Design Techniques",
    content: "Creating websites that look good on any device is essential in today's world...",
    author: "Sarah Williams",
    author_id: 4,
    created_at: "2025-05-03T08:45:00Z",
    updated_at: "2025-05-03T10:15:00Z",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Introduction to Docker",
    content: "Docker is a platform for developing, shipping, and running applications in containers...",
    author: "Michael Brown",
    author_id: 5,
    created_at: "2025-05-02T14:20:00Z",
    updated_at: "2025-05-02T14:20:00Z"
  },
  {
    id: 8,
    title: "PostgreSQL Best Practices",
    content: "PostgreSQL is a powerful, open source object-relational database system...",
    author: "Emily Chen",
    author_id: 6,
    created_at: "2025-05-01T11:10:00Z",
    updated_at: "2025-05-01T11:10:00Z",
    image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop"
  }
];

// Helper to handle API errors consistently
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  toast.error(message);
  return Promise.reject(error);
};

// Auth endpoints
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to login");
    }
    
    // Store token in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to register");
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Blog post endpoints
export const fetchAllPosts = async (page = 1, limit = 6, search = '') => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/posts/${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch posts");
      }
      
      return data;
    } catch (fetchError) {
      console.log("Using mock data because API is unavailable:", fetchError);
      
      // Filter mock data based on search
      let filteredPosts = MOCK_POSTS;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = MOCK_POSTS.filter(post => 
          post.title.toLowerCase().includes(searchLower) || 
          post.content.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by created date (most recent first)
      filteredPosts = [...filteredPosts].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Paginate results
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const paginatedPosts = filteredPosts.slice(startIdx, endIdx);
      
      // Return in the paginated format
      const mockResponse: PaginatedResponse<BlogPost> = {
        items: paginatedPosts,
        total: filteredPosts.length,
        page: page,
        size: limit,
        pages: Math.ceil(filteredPosts.length / limit)
      };
      
      return mockResponse;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPostById = async (id: number) => {
  try {
    const url = `${API_URL}/posts/${id}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch post");
      }
      
      return data;
    } catch (fetchError) {
      console.log("Using mock data because API is unavailable:", fetchError);
      
      // Find the post by ID in the mock data
      const post = MOCK_POSTS.find(p => p.id === id);
      
      if (!post) {
        throw new Error("Post not found");
      }
      
      return post;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const createPost = async (post: FormData) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("You must be logged in to create a post");
    }
    
    const response = await fetch(`${API_URL}/posts/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: post,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to create post");
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updatePost = async (id: number, post: FormData) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("You must be logged in to update a post");
    }
    
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: post,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to update post");
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deletePost = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("You must be logged in to delete a post");
    }
    
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to delete post");
    }
    
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};
