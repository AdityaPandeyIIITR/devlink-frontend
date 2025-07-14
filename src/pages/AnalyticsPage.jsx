import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AnalyticsPage = () => {
  const { shortId } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://devlink-apiii.onrender.com/api/analytics/${shortId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched analytics data:", data);

        setAnalyticsData(data); // { totalClicks: X, clicks: [...] }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortId]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="analytics-container">
      <h1>Analytics for: {shortId}</h1>
      <p><strong>Total Clicks:</strong> {analyticsData?.totalClicks || 0}</p>

      {analyticsData?.clicks.length === 0 ? (
        <p>No analytics found yet.</p>
      ) : (
        <ul>
          {analyticsData.clicks.map((click, index) => (
            <li key={index}>
              <p><strong>IP:</strong> {click.ip}</p>
              <p><strong>User Agent:</strong> {click.userAgent}</p>
              <p><strong>Referrer:</strong> {click.referrer}</p>
              <p><strong>Timestamp:</strong> {new Date(click.timestamp).toLocaleString()}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalyticsPage;
