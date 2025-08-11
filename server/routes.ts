import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Poets routes
  app.get("/api/poets", async (req, res) => {
    try {
      const poets = await storage.getPoets();
      res.json(poets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poets" });
    }
  });

  app.get("/api/poets/:id", async (req, res) => {
    try {
      const poet = await storage.getPoet(req.params.id);
      if (!poet) {
        return res.status(404).json({ message: "Poet not found" });
      }
      res.json(poet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poet" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Shayaris routes
  app.get("/api/shayaris", async (req, res) => {
    try {
      const { poet, category, search } = req.query;
      
      let shayaris;
      if (search && typeof search === 'string') {
        shayaris = await storage.searchShayaris(search);
      } else if (poet && typeof poet === 'string') {
        shayaris = await storage.getShayarisByPoet(poet);
      } else if (category && typeof category === 'string') {
        shayaris = await storage.getShayarisByCategory(category);
      } else {
        shayaris = await storage.getShayaris();
      }
      
      res.json(shayaris);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shayaris" });
    }
  });

  app.get("/api/shayaris/featured", async (req, res) => {
    try {
      const featuredShayari = await storage.getFeaturedShayari();
      if (!featuredShayari) {
        return res.status(404).json({ message: "No featured shayari found" });
      }
      res.json(featuredShayari);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured shayari" });
    }
  });

  app.get("/api/shayaris/:id", async (req, res) => {
    try {
      const shayari = await storage.getShayari(req.params.id);
      if (!shayari) {
        return res.status(404).json({ message: "Shayari not found" });
      }
      res.json(shayari);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shayari" });
    }
  });

  // Favorites routes
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavorites();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:shayariId", async (req, res) => {
    try {
      const success = await storage.removeFavorite(req.params.shayariId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check/:shayariId", async (req, res) => {
    try {
      const isFavorite = await storage.isFavorite(req.params.shayariId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
