import { openDB } from "../../../lib/db.js";

async function openDBConnection() {
  return openDB();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = await openDBConnection();

      // Query for total number of tasks
      const totalTasksQuery = await db.get("SELECT COUNT(*) AS total FROM tasks");
      const totalTasks = totalTasksQuery.total;

      // Query for total number of completed tasks
      const completedTasksQuery = await db.get(
        "SELECT COUNT(*) AS completed FROM tasks WHERE completed = 1"
      );
      const completedTasks = completedTasksQuery.completed;

      // Sending stats response
      const stats = {
        total: totalTasks,
        completed: completedTasks,
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch task stats" });
    }
  } else {
    // Handling non-GET requests
    res.status(405).json({ error: "Method not allowed" });
  }
}
