import { useState } from "react";
import "./App.css";
import Admin from "./admin";
import AdminLogin from "./AdminLogin";

const API_URL = "http://localhost:5000/api/bookings";

const SERVICES = [
  { icon: "🔋", title: "Battery Jump-Start", description: "Help when your vehicle battery runs out.", value: "Battery Jump-Start" },
  { icon: "🛞", title: "Flat Tyre Repair", description: "Get assistance with punctures and flat tyres.", value: "Flat Tyre Repair" },
  { icon: "🔧", title: "Mechanical Repairs", description: "Get help with unexpected mechanical problems.", value: "Engine Repair" },
  { icon: "⛽", title: "Fuel Assistance", description: "Request help when you run out of fuel.", value: "Fuel Delivery" },
  { icon: "🚗", title: "Vehicle Towing", description: "Arrange towing when your vehicle cannot move.", value: "Towing Service" },
  { icon: "🔑", title: "Lockout Assistance", description: "Get help when you are locked out of your vehicle.", value: "Other" },
];

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicle, setVehicle] = useState("Car");
  const [service, setService] = useState("Breakdown Assistance");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleBooking(event) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const name = customerName.trim();
    const phoneNumber = phone.trim();
    const breakdownLocation = location.trim();
    const description = problem.trim();

    if (!name || !breakdownLocation || !description) {
      setMessage("Please fill in your name, location, and problem description.");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone: phoneNumber,
          vehicleType: vehicle,
          serviceRequired: service,
          location: breakdownLocation,
          description,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Booking failed (HTTP ${response.status}).`);
      }

      setIsSuccess(true);

      const bookingId = data.booking?._id || data.bookingId || data.data?._id;

      setMessage(
        bookingId
          ? `Booking submitted successfully! Your booking ID is ${bookingId}.`
          : data.message || "Booking submitted successfully!"
      );

      setCustomerName("");
      setPhone("");
      setVehicle("Car");
      setService("Breakdown Assistance");
      setLocation("");
      setProblem("");
    } catch (error) {
      console.error("Booking error:", error);

      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that it is running on port 5000 and CORS is enabled."
          : error.message || "Something went wrong while submitting your booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAdminLogin(token) {
    setAdminToken(token);
  }

  function handleAdminLogout() {
    setAdminToken("");
    setShowAdmin(false);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="logo" aria-label="RoadRescue home">
          <span className="logo-icon">🚗</span>RoadRescue
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home" onClick={() => setShowAdmin(false)}>Home</a>
          <a href="#services" onClick={() => setShowAdmin(false)}>Services</a>
          <a href="#booking" onClick={() => setShowAdmin(false)}>Book Assistance</a>
        </nav>

        <div className="nav-actions">
          {!showAdmin && (
            <a href="#booking" className="nav-button">
              Get Help
            </a>
          )}

          <button
            type="button"
            className="nav-button"
            onClick={() => setShowAdmin((current) => !current)}
          >
            {showAdmin ? "Customer Website" : "Admin Login"}
          </button>
        </div>
      </header>

      {showAdmin ? (
        adminToken ? (
          <div>
            <div style={{ textAlign: "right", padding: "12px 24px" }}>
              <button type="button" onClick={handleAdminLogout}>
                Admin Logout
              </button>
            </div>
            <Admin token={adminToken} />
          </div>
        ) : (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setShowAdmin(false)}
          />
        )
      ) : (
        <main>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="eyebrow">YOUR JOURNEY, OUR PRIORITY</span>
              <h1>
                Stranded on the road?
                <span> We're here to help.</span>
              </h1>
              <p>
                Vehicle trouble can happen anytime. Find the roadside assistance
                you need and get back on your journey with confidence.
              </p>

              <div className="hero-actions">
                <a href="#booking" className="primary-button">Request Assistance →</a>
                <a href="#services" className="secondary-button">Explore Services</a>
              </div>

              <div className="hero-features">
                <div><strong>🚘</strong><span>Car &amp; Bike Support</span></div>
                <div><strong>🧰</strong><span>Multiple Services</span></div>
                <div><strong>📍</strong><span>Location-Based Requests</span></div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="visual-circle">
                <div className="car-illustration">🚙</div>
                <div className="road-line" />
                <div className="floating-card card-one">
                  <span>🔧</span>
                  <div><strong>Expert Assistance</strong><small>Help when you need it</small></div>
                </div>
                <div className="floating-card card-two">
                  <span>📍</span>
                  <div><strong>Your Location</strong><small>Share your breakdown location</small></div>
                </div>
              </div>
            </div>
          </section>

          <section className="trust-strip" aria-label="Project features">
            <div><strong>6+</strong><span>Roadside Service Types</span></div>
            <div><strong>2</strong><span>Vehicle Categories</span></div>
            <div><strong>1</strong><span>Simple Booking Process</span></div>
          </section>

          <section className="services-section" id="services">
            <div className="section-heading">
              <span className="eyebrow">WHAT WE OFFER</span>
              <h2>Help for every road emergency</h2>
              <p>Choose the assistance you need and tell us what happened.</p>
            </div>

            <div className="services-grid">
              {SERVICES.map((item) => (
                <article className="service-card" key={item.title}>
                  <div className="service-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#booking" onClick={() => setService(item.value)}>
                    Request service →
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="booking-section" id="booking">
            <div className="booking-info">
              <span className="eyebrow">NEED HELP RIGHT NOW?</span>
              <h2>Tell us what's wrong.</h2>
              <p>
                Provide your contact details, vehicle information, location, and
                the problem you're experiencing. We'll save your assistance
                request in our database.
              </p>

              <div className="booking-note">
                <span>🛡️</span>
                <div>
                  <strong>Your safety matters</strong>
                  <p>
                    If you are in immediate danger, move to a safe location if
                    possible and contact local emergency services.
                  </p>
                </div>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              <h3>Request Roadside Assistance</h3>

              <label htmlFor="customerName">Full name</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                pattern="[0-9]{10}"
                title="Enter exactly 10 digits"
                required
              />

              <label htmlFor="vehicle">Vehicle type</label>
              <select
                id="vehicle"
                name="vehicleType"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="service">Service required</label>
              <select
                id="service"
                name="serviceRequired"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="Breakdown Assistance">Breakdown Assistance</option>
                <option value="Battery Jump-Start">Battery Jump-Start</option>
                <option value="Flat Tyre Repair">Flat Tyre Repair</option>
                <option value="Engine Repair">Mechanical Repairs</option>
                <option value="Fuel Delivery">Fuel Assistance</option>
                <option value="Towing Service">Vehicle Towing</option>
                <option value="Other">Lockout / Other Assistance</option>
              </select>

              <label htmlFor="location">Breakdown location</label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter your area or address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <label htmlFor="problem">Describe the problem</label>
              <textarea
                id="problem"
                name="description"
                placeholder="Example: My car won't start."
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              />

              <button
                type="submit"
                className="primary-button submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting booking..." : "Request Assistance →"}
              </button>

              {message && (
                <p
                  className="form-message"
                  role="status"
                  aria-live="polite"
                  style={{
                    color: isSuccess ? "green" : "crimson",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message}
                </p>
              )}

              <p className="form-disclaimer">
                Your request will be saved in the RoadRescue database. Submitting
                a request does not guarantee that a mechanic has accepted it.
              </p>
            </form>
          </section>
        </main>
      )}

      {!showAdmin && (
        <footer className="footer">
          <a href="#home" className="logo footer-logo">
            <span className="logo-icon">🚗</span>RoadRescue
          </a>
          <p>Making roadside assistance simpler, one journey at a time.</p>
          <span>© {new Date().getFullYear()} RoadRescue. Student project.</span>
        </footer>
      )}
    </div>
  );
}

export default App;