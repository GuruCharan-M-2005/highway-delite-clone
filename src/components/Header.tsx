import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="text-2xl font-bold">Logo</div>
        
        <div className="flex items-center gap-2 max-w-md w-full">
          <Input 
            type="search" 
            placeholder="Search experiences..." 
            className="flex-1"
          />
          <Button size="icon" variant="default">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
