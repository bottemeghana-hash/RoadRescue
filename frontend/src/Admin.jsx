import { useEffect, useMemo, useState } from "react";
import "./Admin.css";

const API_URL = "http://localhost:5000/api/bookings";

const STATUSES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

function Admin({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch bookings from the backend
  async function fetchBookings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      if (!response.ok) {
        throw new Error(`Unable to load bookings (HTTP ${response.status}).`);
      }
        const data = await response.json();

const bookingsList = Array.isArray(data)
  ? data
  : data.bookings;

if (!Array.isArray(bookingsList)) {
  throw new Error("Unexpected response from the server.");
}

setBookings(bookingsList);

      
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure the server is running on port 5000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }
useEffect(() => {
  if (token) {
    fetchBookings();
  }
}, [token]);

  // Update a booking's status
  async function updateStatus(bookingId, newStatus) {
    try {
      const response = await fetch(
        `${API_URL}/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update the booking status."
        );
      }

      // Support either { booking: {...} } or a direct booking response.
      const updatedBooking = data.booking || data;

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking
        )
      );
    } catch (err) {
      alert(err.message || "Something went wrong.");
      fetchBookings();
    }
  }

  // Calculate dashboard statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  // Search and filter bookings
  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const name = (booking.customerName || "").toLowerCase();
      const phone = (booking.phone || "").toLowerCase();

      const matchesSearch =
        name.includes(searchText) || phone.includes(searchText);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">ROADRESCUE MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage roadside assistance bookings in one place.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      {/* Dashboard statistics */}
      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Bookings</span>
          <strong>{totalBookings}</strong>
        </article>

        <article className="stat-card pending-card">
          <span>Pending</span>
          <strong>{pendingBookings}</strong>
        </article>

        <article className="stat-card accepted-card">
          <span>Accepted</span>
          <strong>{acceptedBookings}</strong>
        </article>

        <article className="stat-card completed-card">
          <span>Completed</span>
          <strong>{completedBookings}</strong>
        </article>
      </section>

      {/* Bookings table */}
      <section className="bookings-panel">
        <div className="panel-heading">
          <div>
            <h2>Customer Bookings</h2>
            <p>View requests and manage their progress.</p>
          </div>

          <span className="booking-count">
            {filteredBookings.length} booking(s)
          </span>
        </div>

        {/* Search and status filter */}
        <div className="booking-controls">
          <input
            type="search"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search bookings"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by booking status"
          >
            <option value="All">All statuses</option>

            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="admin-message">Loading bookings...</p>
        ) : error ? (
          <div className="admin-message error-message">
            <p>{error}</p>

            <button type="button" onClick={fetchBookings}>
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="admin-message">
            No bookings found. Submit a booking from the customer website or
            change your search filters.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Requested On</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.customerName}</strong>
                      <small>{booking.phone}</small>
                    </td>

                    <td>{booking.vehicleType}</td>

                    <td>{booking.serviceRequired}</td>

                    <td>{booking.location}</td>

                    <td>{formatDate(booking.createdAt)}</td>

                    <td>
                      <span
                        className={`status-badge status-${(
                          booking.status || "Pending"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={booking.status || "Pending"}
                        onChange={(event) =>
                          updateStatus(booking._id, event.target.value)
                        }
                        aria-label={`Update status for ${booking.customerName}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="admin-footer">
        RoadRescue · Roadside Vehicle Assistance Platform
      </footer>
    </div>
  );
}

export default Admin;