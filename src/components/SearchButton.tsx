
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";

const SearchButton = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search for products by keyword
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Search</span>
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="grid grid-cols-3 gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              navigate("/search?categories=Electronics");
              setIsOpen(false);
            }}
          >
            Electronics
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              navigate("/search?categories=Books");
              setIsOpen(false);
            }}
          >
            Books
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              navigate("/search?categories=Furniture");
              setIsOpen(false);
            }}
          >
            Furniture
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchButton;
