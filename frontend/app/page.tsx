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
      // प्रोफेशनल तरीका: सीधा Render का लिंक इस्तेमाल करना ताकि कोई गड़बड़ न हो
      const apiURL = "https://s2h-aligarh.onrender.com"; 
      
      const response = await fetch(`${apiURL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        alert("🎉 Success: " + (data.message || "Booking Saved Successfully!"));
        (e.target as HTMLFormElement).reset(); 
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend से कनेक्शन नहीं हो पाया! कृपया जांचें कि Render पर सर्वर चालू है या नहीं।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "sans-serif", 
      backgroundColor: "#111", 
      color: "white", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>S2H Services</h1>
        <p style={{ color: "#aaa", marginBottom: "30px" }}>Aligarh's Professional Booking System</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            name="name" 
            type="text"
            placeholder="आपका नाम (Your Name)" 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#222", color: "white" }}
            required 
          />
          
          <input 
            name="service" 
            type="text"
            placeholder="कौन सी सर्विस चाहिए? (Service)" 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#222", color: "white" }}
            required 
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: "15px",
              backgroundColor: loading ? "#444" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s"
            }}
          >
            {loading ? "Booking Process हो रही है..." : "Book Service Now"}
          </button>
        </form>
      </div>
    </div>
  );
}