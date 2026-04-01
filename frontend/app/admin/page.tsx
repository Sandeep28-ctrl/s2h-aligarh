 "use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const apiURL = "https://s2h-aligarh.onrender.com";
  const ADMIN_PASSWORD = "S2H_ALIGARH_2026"; // आपका गुप्त पासवर्ड

  // पासवर्ड चेक करने वाला फंक्शन
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      fetchBookings();
    } else {
      alert("गलत पासवर्ड! कृपया सही पासवर्ड डालें।");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${apiURL}/admin/bookings`);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (err) {
      console.error("Data load nahi ho raha", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("क्या आप इस बुकिंग को हटाना चाहते हैं?")) return;
    try {
      const res = await fetch(`${apiURL}/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("सफलता: बुकिंग डिलीट हो गई।");
        fetchBookings();
      }
    } catch (err) {
      alert("Error: डिलीट नहीं हो पाया!");
    }
  };

  // अगर लॉगिन नहीं है, तो सिर्फ लॉगिन फॉर्म दिखाओ
  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111", color: "white" }}>
        <form onSubmit={handleLogin} style={{ padding: "30px", border: "1px solid #444", borderRadius: "10px", textAlign: "center" }}>
          <h2>S2H - Smart Admin Login</h2>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", margin: "15px 0", borderRadius: "5px", border: "none", width: "100%", color: "black" }}
          />
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // अगर लॉगिन सही है, तो टेबल दिखाओ
  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f4f4", minHeight: "100vh", color: "#333" }}>
      {/* नया अपडेटेड नाम यहाँ है */}
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>S2H - Smart Admin Panel 🔐</h1>
      
      {loading ? <p style={{ textAlign: "center" }}>लोड हो रहा है...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#0070f3", color: "white" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Customer Name</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Service Required</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Date & Time</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item: any) => (
                <tr key={item._id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.service}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(item.date).toLocaleString()}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button onClick={() => deleteBooking(item._id)} style={{ padding: "5px 10px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p style={{ textAlign: "center", padding: "20px" }}>अभी कोई नई बुकिंग नहीं है।</p>}
        </div>
      )}
    </div>
  );
}