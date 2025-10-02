import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  async function fetchUserDetails() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the user's details");
      }
      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify center">
        <div className="text-xl font-semibold text-gray-600">
          Loading user's details
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-semibold text-red-600 mb-4">
          {error || "User was not found"}
        </div>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Back to Users
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Users
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-blue-100 mt-1">@{user.username}</p>
          </div>
          <div className="px-8 py-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {user.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </label>
                  <a
                    href={`tel:${user.phone}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {user.phone}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Website
                  </label>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Address
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {user.address.suite} {user.address.street}
                </p>
                <p className="text-gray-700">
                  {user.address.city}, {user.address.zipcode}
                </p>
                {user.address.geo && (
                  <div className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">Coordinates:</span> Lat:{" "}
                    {user.address.geo.lat}, Lng: {user.address.geo.lng}
                  </div>
                )}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Company
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {user.company.name}
                </h3>
                <p className="text-gray-600 italic mb-2">
                  "{user.company.catchPhrase}"
                </p>
                <p className="text-gray-500 text-sm">{user.company.bs}</p>
              </div>
            </section>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              View All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
