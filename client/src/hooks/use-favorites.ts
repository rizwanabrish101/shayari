import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type ShayariWithPoet } from "@shared/schema";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: favorites } = useQuery<ShayariWithPoet[]>({
    queryKey: ["/api/favorites"],
  });

  useEffect(() => {
    if (favorites) {
      setFavoriteIds(new Set(favorites.map(f => f.id)));
    }
  }, [favorites]);

  const addFavoriteMutation = useMutation({
    mutationFn: async (shayariId: string) => {
      const response = await apiRequest("POST", "/api/favorites", { shayariId });
      return response.json();
    },
    onSuccess: (_, shayariId) => {
      setFavoriteIds(prev => new Set([...prev, shayariId]));
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (shayariId: string) => {
      const response = await apiRequest("DELETE", `/api/favorites/${shayariId}`);
      return response.json();
    },
    onSuccess: (_, shayariId) => {
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(shayariId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const addFavorite = async (shayariId: string) => {
    return addFavoriteMutation.mutateAsync(shayariId);
  };

  const removeFavorite = async (shayariId: string) => {
    return removeFavoriteMutation.mutateAsync(shayariId);
  };

  const isFavorite = (shayariId: string) => {
    return favoriteIds.has(shayariId);
  };

  return {
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoading: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
