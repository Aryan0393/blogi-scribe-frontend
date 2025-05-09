
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlogFormProps {
  initialValues?: {
    title: string;
    content: string;
  };
  onSubmit: (values: { title: string; content: string }) => void;
  isSubmitting: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  initialValues = { title: "", content: "" }, 
  onSubmit,
  isSubmitting
}) => {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter post title..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={values.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows={12}
          required
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : initialValues.title ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
};

export default BlogForm;
