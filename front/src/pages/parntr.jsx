import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message, error);
    return Promise.reject(error);
  }
);

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [newPartner, setNewPartner] = useState({
    id: "",
    name: "",
    description: "",
    image: "",

    url: "",
  });

  const fetchPartners = async () => {
    try {
      const response = await api.get("/api/admin/partners");
      if (Array.isArray(response.data)) {
        setPartners(response.data);
      } else {
        console.error("Error: Expected an array but got:", response.data);
        setPartners([]); // fallback to empty array
      }
    } catch (error) {
      console.error(
        "Error fetching partners:",
        error.response?.data || error.message
      );
    }
  };

  const handleAdd = async () => {
    try {
      await api.post("/api/admin/partners", newPartner);
      await fetchPartners();
    } catch (error) {
      if (error.response) {
        console.error(
          "Error adding partner:",
          error.response.data,
          "Status:",
          error.response.status
        );
      } else if (error.request) {
        console.error(
          "Error adding partner, no response received:",
          error.request
        );
      } else {
        console.error("Error adding partner:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Partners Management (Admin)</h1>
      {/* New Partner Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="ID"
          onChange={(e) =>
            setNewPartner({ ...newPartner, id: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <input
          placeholder="Name"
          onChange={(e) =>
            setNewPartner({ ...newPartner, name: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <input
          placeholder="Description"
          onChange={(e) =>
            setNewPartner({ ...newPartner, description: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <input
          placeholder="Image URL"
          onChange={(e) =>
            setNewPartner({ ...newPartner, image: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <input
          placeholder="Banner URL"
          onChange={(e) =>
            setNewPartner({ ...newPartner, banner: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <input
          placeholder="Website URL"
          onChange={(e) =>
            setNewPartner({ ...newPartner, url: e.target.value })
          }
          style={{ marginRight: "5px" }}
        />
        <button onClick={handleAdd}>Add Partner</button>
      </div>

      {/* Display Partners */}
      <div>
        {Array.isArray(partners) && partners.length > 0 ? (
          partners.map((partner) => (
            <div
              key={partner.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h2>{partner.name}</h2>
              <p>{partner.description}</p>
              <div>
                <img
                  src={partner.image}
                  alt={partner.name}
                  style={{ width: "100px", marginRight: "10px" }}
                />
                <img
                  src={partner.banner}
                  alt={partner.name}
                  style={{ width: "100px" }}
                />
              </div>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit
              </a>
            </div>
          ))
        ) : (
          <p>No partners to display.</p>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;
