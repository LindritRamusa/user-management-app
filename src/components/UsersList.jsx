import React, { use } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddUserForm from "./AddUserForm";
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchInput, users]);

  function filterUsers() {
    if (!searchInput.trim()) {
      setFilteredUsers(users);
      return;
    }
    const input = searchInput.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(input) ||
        user.email.toLowerCase().includes(input) ||
        user.company?.name?.toLowerCase().includes(input)
    );
    setFilteredUsers(filtered);
  }

  function handleAddUser(newUser) {
    const userWithId = {
      ...newUser,
      id: Date.now(),
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      phone: "",
      website: "",
      company: {
        name: newUser.company || "",
      },
    };
    setUsers([userWithId, ...users]);
    setShowAddForm(false);
  }

  function handleSearchChange(event) {
    setSearchInput(event.target.value);
  }

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the users");
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError.message;
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          Loading users...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LINKPLUS IT React Internship Challenge - User Management App
          </h1>
          <p className="text-gray-600">Manage and view user information</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            {showAddForm ? "Cancel" : "Add New User"}
          </button>
        </div>
        {showAddForm && (
          <div className="mb-6">
            <AddUserForm
              onAddUser={handleAddUser}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
        <div className="mb-4 text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
         {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No users found matching your search.</p>
          </div>
        ) :(
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.company?.name || "Empty"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/user/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default UsersList;
