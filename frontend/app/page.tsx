"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      service: formData.get("service"),
    };

    try {
      // Professional तरीका: http://localhost:5000 की जगह variable इस्तेमाल करना
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${apiURL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        alert("Success: " + (data.message || "Booking Saved!"));
        (e.target as HTMLFormElement).reset(); // Form खाली करने के लिए
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend connect nahi ho raha! Check if server is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 className="text-2xl font-bold mb-4">S2H Services (Aligarh)</h1>
      <p className="mb-6 text-gray-600">प्रोफेशनल बुकिंग सिस्टम</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input 
          name="name" 
          type="text"
          placeholder="आपका नाम (Your Name)" 
          className="border p-2 rounded text-black" 
          required 
        />
        
        <input 
          name="service" 
          type="text"
          placeholder="कौन सी सर्विस चाहिए? (Service)" 
          className="border p-2 rounded text-black" 
          required 
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Booking Process हो रही है..." : "Book Service Now"}
        </button>
      </form>
    </div>
  );
}