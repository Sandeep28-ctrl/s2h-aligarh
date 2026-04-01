 "use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, service }),
    });

    const data = await res.text();
    alert(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>S2H Services (Aligarh)</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Service (plumbing, cleaning...)"
          onChange={(e) => setService(e.target.value)}
        />
        <br /><br />

        <button type="submit">Book Service</button>
      </form>
    </div>
  );
}