import { useEffect, useState } from "react";
import { getGroceryPrices } from "../services/groceryService.js";
import { getFridge, saveIngredients, getMissingIngredients } from "../services/fridgeService.js";
import GroceryListResult from "../components/GroceryListResult.jsx";

function GroceryListPage() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const userId = localStorage.getItem("userId");

  // Load missing ingredients from database on mount
  useEffect(() => {
    if (!userId) {
      setLoaded(true);
      return;
    }

    const loadMissingIngredients = async () => {
      try {
        console.log("GroceryListPage: Loading missing ingredients from database for userId:", userId);
        const data = await getMissingIngredients(userId);
        console.log("GroceryListPage: Loaded missing ingredients:", data);
        setMissingIngredients(data.missingIngredients || []);
        setError("");
      } catch (err) {
        console.error("GroceryListPage: Failed to load missing ingredients:", err);
        setError("Could not load missing ingredients.");
        setMissingIngredients(null);
      } finally {
        setLoaded(true);
      }
    };

    loadMissingIngredients();
  }, [userId]);

  // Restore grocery items and missing ingredients from localStorage on mount
  useEffect(() => {
    if (loaded) return; // Skip if already loaded
    
    const savedGroceryItems = localStorage.getItem("groceryItems");
    const savedMissingIngredients = localStorage.getItem("currentMissingIngredients");
    
    if (savedGroceryItems) {
      try {
        setGroceryItems(JSON.parse(savedGroceryItems));
      } catch (err) {
        console.error("Failed to restore grocery items:", err);
      }
    }
    
    if (savedMissingIngredients) {
      try {
        setMissingIngredients(JSON.parse(savedMissingIngredients));
      } catch (err) {
        console.error("Failed to restore missing ingredients:", err);
      }
    }
  }, [loaded]);

  // Fetch grocery prices when user clicks the button
  const handleFetchPrices = async () => {
    if (!userId || !missingIngredients || missingIngredients.length === 0) {
      setError("No missing ingredients to fetch prices for.");
      return;
    }

    try {
      console.log("GroceryListPage: Fetching prices for:", missingIngredients);
      setIsFetching(true);
      setError("");

      const allOffers = [];
      await getGroceryPrices(missingIngredients, (data) => {
        console.log("GroceryListPage: Received data from getGroceryPrices:", data);
        if (data.offers && Array.isArray(data.offers)) {
          allOffers.push(...data.offers);
          setGroceryItems([...allOffers]);
          // Save to localStorage to persist across page refreshes
          localStorage.setItem("groceryItems", JSON.stringify([...allOffers]));
          localStorage.setItem("currentMissingIngredients", JSON.stringify(missingIngredients));
        }
      });

      console.log("GroceryListPage: Final grocery items:", allOffers);
    } catch (err) {
      console.error("Error fetching grocery prices:", err);
      setError("Could not retrieve grocery prices. Please try again.");
      setGroceryItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Refresh/regenerate missing ingredients
  const handleRefreshMissingIngredients = async () => {
    if (!userId) return;

    try {
      console.log("GroceryListPage: Refreshing missing ingredients...");
      setIsLoading(true);
      setError("");
      
      const data = await getMissingIngredients(userId);
      setMissingIngredients(data.missingIngredients || []);
      setGroceryItems([]); // Clear previous prices
      // Clear localStorage for grocery items
      localStorage.removeItem("groceryItems");
      localStorage.removeItem("currentMissingIngredients");
    } catch (err) {
      console.error("Error refreshing missing ingredients:", err);
      setError("Could not refresh missing ingredients.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBought = async (item) => {
    if (!userId) {
      setError("User not found :(");
      return;
    }

    try {
      // Get current fridge ingredients
      const fridge = await getFridge(userId);
      const currentIngredients = fridge?.ingredients || [];
      
      // Add the bought item to the fridge
      const updatedIngredients = [
        ...currentIngredients,
        {
          name: item.name,
          quantity: 1,
          unit: "units",
        },
      ];

      await saveIngredients(userId, updatedIngredients);

      // Remove the item from the grocery list
      setGroceryItems((prev) =>
        prev.filter((groceryItem, index) =>
          groceryItem._id
            ? groceryItem._id !== item._id
            : index !== prev.indexOf(item),
        ),
      );

      // Update missing ingredients list
      setMissingIngredients((prev) =>
        prev ? prev.filter((ing) => ing !== item.name) : []
      );

      setError("");
    } catch (err) {
      console.error("Error marking item as bought:", err);
      setError("Could not add ingredient to fridge :(");
    }
  };

  return (
    <div style={{ margin: "auto", width: "100%" }}>
      {!loaded ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>
      ) : error ? (
        <div>
          <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
            {error}
          </p>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button onClick={handleRefreshMissingIngredients} disabled={isLoading}>
              Try Again
            </button>
          </div>
        </div>
      ) : !missingIngredients || missingIngredients.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Go to your Fridge and click <strong>"Generate Missing Ingredients"</strong> to load items you need to buy!
        </p>
      ) : isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Refreshing ingredients list...</p>
        </div>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: "#e8f4f8", 
            padding: "16px", 
            marginBottom: "16px",
            borderRadius: "4px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#555", fontWeight: "bold" }}>
              Missing Ingredients: {missingIngredients.length}
            </p>
            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#777" }}>
              {missingIngredients.join(", ")}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              <button 
                onClick={handleFetchPrices}
                disabled={isFetching || isLoading}
                style={{ padding: "8px 16px", backgroundColor: "#2e77ca", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                {isFetching ? "Fetching Prices..." : "Get Prices"}
              </button>
              <button 
                onClick={handleRefreshMissingIngredients}
                disabled={isLoading || isFetching}
                style={{ padding: "8px 16px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                {isLoading ? "Refreshing..." : "Refresh List"}
              </button>
            </div>
          </div>
          
          {isFetching ? (
            <p style={{ textAlign: "center", marginTop: "16px" }}>Fetching prices, please wait...</p>
          ) : groceryItems.length > 0 ? (
            <GroceryListResult
              groceryItems={groceryItems}
              onBought={handleBought}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GroceryListPage;
