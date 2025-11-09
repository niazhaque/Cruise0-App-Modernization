import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

// ✅ ISO Country Code → Full Country Name Map
const COUNTRY_NAMES = {
  CA: "Canada",
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IN: "India",
  AE: "United Arab Emirates",
  PK: "Pakistan",
  BD: "Bangladesh",
  AU: "Australia",
  SG: "Singapore",
  NL: "Netherlands",
  QA: "Qatar",
  SA: "Saudi Arabia",
  // Add more if needed
};

export default function Dashboard() {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState(null);

  // ✅ Extract raw country from custom claim
  const rawCountry = user?.["https://cruise0/country"] || "Unknown";
  const country = COUNTRY_NAMES[rawCountry] || rawCountry; // Convert code to full name

  async function callApi() {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:4000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(JSON.stringify({ error: err.message }, null, 2));
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://cruise0-photo-public.s3.ca-central-1.amazonaws.com/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.17)",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          width: "850px",
          padding: "55px 40px",
          textAlign: "center",
          boxShadow: "0 10px 45px rgba(0,0,0,0.35)",
        }}
      >
        <img
          src="https://cruise0-photo-public.s3.ca-central-1.amazonaws.com/cruise.PNG"
          alt="Logo"
          style={{ width: "140px", marginBottom: "25px" }}
        />

        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "white",
          }}
        >
          Welcome {user?.name}
        </h1>

        {/* ✅ Full Country Name Display */}
        <p
          style={{
            color: "white",
            fontSize: "20px",
            marginBottom: "30px",
          }}
        >
          Logged in from: {country}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={callApi}
            style={{
              padding: "12px 28px",
              fontSize: "18px",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#ffffff",
            }}
          >
            Call Protected API
          </button>

          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            style={{
              padding: "12px 28px",
              fontSize: "18px",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#ffffff",
            }}
          >
            Logout
          </button>
        </div>

        {result && (
          <pre
            style={{
              background: "rgba(0,0,0,0.4)",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "left",
              fontSize: "16px",
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
