import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Badge } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import BadgeForm from "./BadgeForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search, RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getBadgeIcon } from "@/lib/badge-icons";

export default function BadgeManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Fetch badges
  const { data: badges, isLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
  });

  // Create badge mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Badge>) => {
      const res = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create badge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
  });

  // Update badge mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Badge> }) => {
      const res = await fetch(`/api/badges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update badge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
  });

  // Delete badge mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/badges/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete badge");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
  });

  const handleEdit = (badge: Badge) => {
    setSelectedBadge(badge);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedBadge(null);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = (badge: Badge) => {
    setSelectedBadge(badge);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBadge) return;

    try {
      await deleteMutation.mutateAsync(selectedBadge.id);
      toast({
        title: "Success",
        description: "Badge deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete badge",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBadge(null);
    }
  };

  const handleSubmit = async (data: Partial<Badge>) => {
    if (selectedBadge) {
      await updateMutation.mutateAsync({ id: selectedBadge.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setDialogOpen(false);
    setSelectedBadge(null);
  };

  const handleDialogClose = (refresh: boolean = false) => {
    setDialogOpen(false);
    setSelectedBadge(null);
    if (refresh) {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    }
  };

  const filteredBadges = badges?.filter((badge) =>
    badge.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Badge Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/badges"] })}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Badge
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Required Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBadges?.map((badge) => (
              <TableRow key={badge.id}>
                <TableCell>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getBadgeIcon(badge.icon, "h-4 w-4 text-primary")}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{badge.name}</TableCell>
                <TableCell className="max-w-md truncate">{badge.description}</TableCell>
                <TableCell>{badge.requiredCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(badge)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConfirm(badge)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBadge ? "Edit Badge" : "Create New Badge"}
            </DialogTitle>
            <DialogDescription>
              {selectedBadge
                ? "Update the badge details below."
                : "Fill in the badge details below."}
            </DialogDescription>
          </DialogHeader>
          <BadgeForm
            badge={selectedBadge || undefined}
            onSubmit={handleSubmit}
            onCancel={() => handleDialogClose()}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Badge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this badge? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 