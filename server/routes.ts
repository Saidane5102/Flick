import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { z } from "zod";
import { insertCardSchema, insertDesignSchema, insertCommentSchema } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup file uploads
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit as per requirements
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Serve uploaded files statically
  app.use("/uploads", (req, res, next) => {
    // Simple auth check for user-uploaded content
    if (req.isAuthenticated()) {
      return express.static(uploadsDir)(req, res, next);
    }
    next();
  });

  // Card routes
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const cards = await storage.getCardsByCategory(category);
      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards by category" });
    }
  });

  // Admin card routes
  app.post("/api/admin/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create card" });
    }
  });

  app.put("/api/admin/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(id, validatedData);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.status(200).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update card" });
    }
  });

  app.delete("/api/admin/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCard(id);
      
      if (!success) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  // Design submission routes
  app.get("/api/designs", async (req, res) => {
    try {
      const designs = await storage.getDesigns();
      res.status(200).json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const designs = await storage.getDesignsByUser(userId);
      res.status(200).json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs by user" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.status(200).json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", upload.single("image"), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Must be logged in to submit designs" });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      
      const user = req.user as Express.User;
      const imageUrl = `/uploads/${req.file.filename}`;
      
      // Validate the rest of the form data
      const designData = {
        ...req.body,
        userId: user.id,
        imageUrl,
        cardIds: JSON.parse(req.body.cardIds)
      };
      
      const validatedData = insertDesignSchema.parse(designData);
      const design = await storage.createDesign(validatedData);
      
      res.status(201).json(design);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid design data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit design" });
    }
  });

  app.post("/api/designs/:id/like", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Must be logged in to like designs" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const design = await storage.likeDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.status(200).json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to like design" });
    }
  });

  // Comment routes
  app.get("/api/designs/:designId/comments", async (req, res) => {
    try {
      const designId = parseInt(req.params.designId);
      const comments = await storage.getCommentsByDesign(designId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Must be logged in to comment" });
    }
    
    try {
      const user = req.user as Express.User;
      const commentData = {
        ...req.body,
        userId: user.id
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedData);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to post comment" });
    }
  });

  // Badge and progress tracking routes
  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.status(200).json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userBadges = await storage.getUserBadges(userId);
      res.status(200).json(userBadges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import express from "express";
