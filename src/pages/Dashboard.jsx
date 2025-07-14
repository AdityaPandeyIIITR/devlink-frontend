import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://devlink-apiii.onrender.com/api/links", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLinks(data); //////
      } catch (err) {
        console.error("Failed to fetch links:", err);
      }
    };

    fetchLinks();
  }, []);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied!");
  };


  const [originalUrl, setOriginalUrl] = useState("");

  const handleShorten = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Sending URL to backend:", originalUrl);

      const res = await fetch("https://devlink-apiii.onrender.com/api/links/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl }),
      });

      console.log("Waiting for backend response...");

      const data = await res.json();

      console.log("API response:", data);
      
      if (res.ok) {
        console.log("Shortened link response:", data); 
        alert("Short URL created!");
        setLinks([
          {
            originalUrl: data.originalUrl,
            shortId: data.shortId,
            shortUrl: data.shortUrl,
            clicks: 0,
            createdAt: new Date().toISOString()
          },
          ...links
        ]);
        
        setOriginalUrl(""); // reset input
      } else {
        console.log("Error from server:", data);
        alert(data.message || "Failed to shorten link.");
      }
    } catch (err) { 
      console.error("Error creating short link:", err);
    }
  };


  return (
    <div className="dashboard-container">

      <div className="shorten-form">
        <input
        type="text"
        placeholder="Enter URL to shorten"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button onClick={handleShorten}>Shorten</button>
      </div>

      <h1>Your Short Links</h1>
      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <ul className="link-list">
          {links.map((link) => (
            <li key={link.shortId} className="link-card">
              <p><strong>Original:</strong> <a href={link.originalUrl} target="_blank">{link.originalUrl}</a></p>
              <p><strong>Short:</strong> <a href={`https://devlink-apiii.onrender.com/${link.shortId}`} target="_blank">{`https://devlink-apiii.onrender.com/${link.shortId}`}</a></p>
              <p><strong>Clicks:</strong> {link.clicks}</p>
              <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
              <button onClick={() => handleCopy(`https://devlink-apiii.onrender.com/${link.shortId}`)}>Copy Link</button>
              <p><a href={`/analytics/${link.shortId}`}>View Analytics</a></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
