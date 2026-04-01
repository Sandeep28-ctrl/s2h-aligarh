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
      const apiURL = "https://s2h-aligarh.onrender.com"; 
      const response = await fetch(`${apiURL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        alert("🎉 बधाई! आपकी बुकिंग सुरक्षित हो गई है। हम जल्द ही आपसे संपर्क करेंगे।");
        (e.target as HTMLFormElement).reset(); 
      } else {
        alert("❌ एरर: " + data.message);
      }
    } catch (error) {
      alert("कनेक्शन एरर! कृपया इंटरनेट चेक करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#0f172a", color: "white", minHeight: "100vh" }}>
      
      {/* Header / Hero Section - Updated with Smart Services to Home */}
      <header style={{ padding: "80px 20px", textAlign: "center", background: "linear-gradient(to bottom, #1e293b, #0f172a)" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "10px", color: "#38bdf8" }}>
          S2H - Smart Services to Home
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#94a3b8", maxWidth: "600px", margin: "0 auto" }}>
          Aligarh की सबसे स्मार्ट होम सर्विस कंपनी। अब एक क्लिक में एक्सपर्ट्स को घर बुलाएं।
        </p>
      </header>

      <main style={{ maxWidth: "1000px", margin: "-50px auto 50px", padding: "0 20px" }}>
        
        {/* Booking Form Card */}
        <section style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", border: "1px solid #334155" }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.8rem" }}>Book Your Service Now</h2>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>आपका पूरा नाम (Full Name)</label>
              <input 
                name="name" 
                type="text"
                placeholder="जैसे: Sandeep Singh" 
                style={{ padding: "14px", borderRadius: "10px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", outline: "none" }}
                required 
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>कौन सी सर्विस चाहिए? (Select Service)</label>
              <select 
                name="service" 
                style={{ padding: "14px", borderRadius: "10px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", outline: "none" }}
                required
              >
                <option value="">-- सर्विस चुनें --</option>
                <option value="House Cleaning">House Cleaning (घर की सफाई)</option>
                <option value="AC Repair">AC Repair & Service</option>
                <option value="Electrician">Electrician (बिजली का काम)</option>
                <option value="Plumbing">Plumbing (नल का काम)</option>
                <option value="Other">Other (अन्य)</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: "16px",
                backgroundColor: loading ? "#475569" : "#0284c7",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                marginTop: "10px"
              }}
            >
              {loading ? "Processing..." : "Confirm Booking 🚀"}
            </button>
          </form>
        </section>

        {/* Features Section */}
        <section style={{ marginTop: "80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", textAlign: "center" }}>
          <div style={{ padding: "20px", background: "#1e293b", borderRadius: "15px" }}>
            <h3 style={{ color: "#38bdf8" }}>⚡ Fast Service</h3>
            <p style={{ color: "#94a3b8" }}>बुकिंग के 2 घंटे के अंदर हमारे एक्सपर्ट्स आपके घर पहुँचेंगे।</p>
          </div>
          <div style={{ padding: "20px", background: "#1e293b", borderRadius: "15px" }}>
            <h3 style={{ color: "#38bdf8" }}>🛡️ Trusted Pros</h3>
            <p style={{ color: "#94a3b8" }}>सभी कर्मचारी पुलिस वेरीफाइड और अनुभवी हैं।</p>
          </div>
          <div style={{ padding: "20px", background: "#1e293b", borderRadius: "15px" }}>
            <h3 style={{ color: "#38bdf8" }}>💰 Fair Pricing</h3>
            <p style={{ color: "#94a3b8" }}>मार्केट से बेहतर रेट्स और काम की पूरी गारंटी।</p>
          </div>
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/+916397951585?text=नमस्ते S2H - Smart Services! मुझे एक सर्विस बुक करनी है।"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#25d366",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          zIndex: 1000,
          textDecoration: "none",
          transition: "transform 0.3s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          style={{ width: "35px" }} 
        />
      </a>

      <footer style={{ textAlign: "center", padding: "40px", color: "#64748b", borderTop: "1px solid #1e293b" }}>
        © 2026 S2H - Smart Services to Home Aligarh. All rights reserved.
      </footer>
    </div>
  );
}