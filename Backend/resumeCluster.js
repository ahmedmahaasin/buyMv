import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const resumeCluster = async () => {
  const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${process.env.ATLAS_PROJECT_ID}/clusters/${process.env.ATLAS_CLUSTER_NAME}`;

  const body = {
    paused: false
  };

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      // Basic Auth with public & private keys
      auth: `${process.env.ATLAS_PUBLIC_KEY}:${process.env.ATLAS_PRIVATE_KEY}`
    });

    if (res.ok) {
      console.log("Cluster resumed successfully");
    } else {
      const errorData = await res.json();
      console.log("Failed to resume cluster:", errorData);
    }
  } catch (err) {
    console.log("Error resuming cluster:", err);
  }
};
