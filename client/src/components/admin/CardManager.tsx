import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card as CardType, CardCategory, DifficultyLevel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import CardForm from "./CardForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search, RefreshCcw, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function CardManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Fetch all cards
  const { data: cards, isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
    queryFn: async () => {
      const response = await fetch("/api/cards");
      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }
      return response.json();
    },
  });

  // Delete card mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete card");
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card deleted",
        description: "The card has been successfully deleted",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle opening edit dialog
  const handleEdit = (card: CardType) => {
    setSelectedCard(card);
    setDialogOpen(true);
  };

  // Handle opening new card dialog
  const handleNew = () => {
    setSelectedCard(null);
    setDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (card: CardType) => {
    setSelectedCard(card);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleDelete = () => {
    if (selectedCard) {
      deleteMutation.mutate(selectedCard.id);
    }
  };

  // Filter and search cards
  const filteredCards = cards
    ? cards.filter((card) => {
        // Category filter
        if (categoryFilter !== "all" && card.category !== categoryFilter) {
          return false;
        }
        
        // Search term
        if (
          searchTerm &&
          !card.promptText.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !card.backContent.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        
        return true;
      })
    : [];

  // Handle dialog close
  const handleDialogClose = (refresh: boolean = false) => {
    setDialogOpen(false);
    if (refresh) {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={CardCategory.CLIENT}>{CardCategory.CLIENT}</SelectItem>
                <SelectItem value={CardCategory.NEED}>{CardCategory.NEED}</SelectItem>
                <SelectItem value={CardCategory.CHALLENGE}>{CardCategory.CHALLENGE}</SelectItem>
                <SelectItem value={CardCategory.AUDIENCE}>{CardCategory.AUDIENCE}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/cards"] })}
            className="flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleNew} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Cards Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No cards found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>{card.id}</TableCell>
                    <TableCell>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${card.category === CardCategory.CLIENT ? 'bg-teal-100 text-teal-800' : ''}
                        ${card.category === CardCategory.NEED ? 'bg-orange-100 text-orange-800' : ''}
                        ${card.category === CardCategory.CHALLENGE ? 'bg-purple-100 text-purple-800' : ''}
                        ${card.category === CardCategory.AUDIENCE ? 'bg-emerald-100 text-emerald-800' : ''}
                      `}>
                        {card.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{card.promptText}</TableCell>
                    <TableCell>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${card.difficulty === DifficultyLevel.BEGINNER ? 'bg-green-100 text-green-800' : ''}
                        ${card.difficulty === DifficultyLevel.INTERMEDIATE ? 'bg-blue-100 text-blue-800' : ''}
                        ${card.difficulty === DifficultyLevel.ADVANCED ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {card.difficulty}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(card)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteConfirm(card)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Card Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCard ? "Edit Card" : "Add New Card"}
            </DialogTitle>
            <DialogDescription>
              {selectedCard
                ? "Update the card details below."
                : "Fill in the card details to create a new card."}
            </DialogDescription>
          </DialogHeader>
          <CardForm
            card={selectedCard}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the card "{selectedCard?.promptText}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
