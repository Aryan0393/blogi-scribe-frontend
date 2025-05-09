import { LoginCredentials, RegisterCredentials, BlogPost } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://localhost:8000/api"; // Replace with your actual API URL

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
    
    const response = await fetch(url);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch posts");
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPostById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch post");
    }
    
    return data;
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
