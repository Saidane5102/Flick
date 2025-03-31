import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AdminPromotionTool from "./AdminPromotionTool";

export default function AdminSetupButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs opacity-70 rounded-md border-[#E9E6DD] text-[#414141]"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-3 w-3 mr-1.5" />
        Admin Setup
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none">
          <AdminPromotionTool />
        </DialogContent>
      </Dialog>
    </>
  );
}