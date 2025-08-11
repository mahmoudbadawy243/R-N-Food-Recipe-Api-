import express from "express";
import { ENV } from "./config/env.js"; 
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
const app = express();
const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
}
)

app.use(express.json()); // without this line req.body will be undefined and all variable


// ---------------------------------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true });
});


// ---------------------------------------------------------------------------

// Add to Favorite
app.post("/api/favorites", async (req, res) => {
try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
    return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db.insert(favoritesTable).values({
        userId, recipeId, title, image, cookTime, servings,
        }) .returning();
    
    res.status(201).json(newFavorite[0]); // 201 meaning something is created successfully
    
} catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
    }
});

// ---------------------------------------------------------------------------

// delete from Favorite
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
    const { userId, recipeId } = req.params;

    await db
        .delete(favoritesTable)
        .where(
        and( eq(favoritesTable.userId, userId) , eq(favoritesTable.recipeId, parseInt(recipeId)) )
        );

    res.status(200).json({ message: "Favorite removed successfully" });

    } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
    }
});

// ---------------------------------------------------------------------------

// fetch favorites
app.get("/api/favorites/:userId", async (req, res) => {
    try {
    const { userId } = req.params;

    const userFavorites = await db
        .select()
        .from(favoritesTable)
        .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
    
    } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
    }
});

// --------------------------------------------------------------------------



/*
=========================================================================================================
=========================================  Backend  =====================================================
=========================================================================================================



=== npm i express@5.1.0 @neondatabase/serverless@1.0.0 cors@2.8.5 dotenv@16.5.0 drizzle-orm@0.44.2 cron@4.3.0

=== npm i nodemon@3.1.10 -D

=== npm i drizzle-kit@0.31.1 -D

=== in "package.json" file write "type": "module", to be enable to use impoer and export

=== in "package.json" file change
"scripts": {
    "dev": "src/nodemon server.js", >>> in development mode : npm run dev 
    "start": "src/node server.js" >>> in production mode : npm run start
}

=== create "src" folder 
=== create "config" folder inside "src" 
=== create "server.js" file inside "src"
=== create "env.js" file inside "config"
=== create "db" folder inside "src"
=== create "schema.js" file inside "db"
=== create "db.js" file inside "config"
=== create "drizzle.config.js" file inside "backend"
=== "npx drizzle-kit generate"
=== "npx drizzle-kit migrate"
=== create api end-points in "server.js"
=== create ".gitignore" file inside "backend" 
=== 
*/