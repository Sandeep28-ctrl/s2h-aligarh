 "use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiURL = "https://s2h-aligarh.onrender.com";

  // बुकिंग्स लोड करने का फंक्शन
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

  // डिलीट करने का फंक्शन
  const deleteBooking = async (id: string) => {
    if (!confirm("क्या आप इस बुकिंग को हटाना चाहते हैं?")) return;
    
    try {
      const res = await fetch(`${apiURL}/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("बधाई! बुकिंग डिलीट हो गई।");
        fetchBookings(); // लिस्ट अपडेट करें
      }
    } catch (err) {
      alert("डिलीट नहीं हो पाया!");
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f4f4", minHeight: "100vh", color: "#333" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>S2H Aligarh - Admin Panel</h1>
      
      {loading ? <p style={{ textAlign: "center" }}>लोड हो रहा है...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#0070f3", color: "white" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>नाम (Customer)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>सर्विस (Service)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>तारीख (Date)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>एक्शन (Action)</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item: any) => (
                <tr key={item._id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.service}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(item.date).toLocaleString()}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button 
                      onClick={() => deleteBooking(item._id)}
                      style={{ padding: "5px 10px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p style={{ textAlign: "center", padding: "20px" }}>अभी कोई बुकिंग नहीं है।</p>}
        </div>
      )}
    </div>
  );
}