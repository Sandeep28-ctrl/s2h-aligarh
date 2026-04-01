"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiURL}/admin/bookings`);
      const result = await res.json();
      if (result.success) setBookings(result.data);
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 className="text-2xl font-bold mb-4">S2H Aligarh - Admin Panel</h1>
      <table border={1} style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Service</th>
            <th style={{ padding: "10px" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b: any) => (
            <tr key={b._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{b.name}</td>
              <td style={{ padding: "10px" }}>{b.service}</td>
              <td style={{ padding: "10px" }}>{new Date(b.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}