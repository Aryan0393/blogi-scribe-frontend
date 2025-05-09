
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, X } from "lucide-react";

interface BlogFormProps {
  initialValues?: {
    title: string;
    content: string;
    image_url?: string;
  };
  onSubmit: (values: FormData) => void;
  isSubmitting: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  initialValues = { title: "", content: "", image_url: "" }, 
  onSubmit,
  isSubmitting
}) => {
  const [values, setValues] = useState(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (previewUrl === null && initialValues.image_url) {
      // User removed the existing image
      formData.append("remove_image", "true");
    }
    
    onSubmit(formData);
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
        <Label htmlFor="image">Image (Optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        
        {previewUrl && (
          <div className="relative mt-2 w-full max-w-md">
            <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-7 w-7"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
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
