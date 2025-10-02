import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../store/usersSlice";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";

function UsersList() {
  const dispatch = useDispatch();
  const {
    items: users,
    isLoading: loading,
    hasError: error,
  } = useSelector((state) => state.users);

  const [searchInput, setSearchInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (users.length === 0 && !error) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, error]);

  const filteredUsers = useMemo(() => {
    if (!searchInput.trim()) {
      return users;
    }
    const input = searchInput.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(input) ||
        user.email.toLowerCase().includes(input) ||
        user.company?.name?.toLowerCase().includes(input)
    );
  }, [users, searchInput]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "company") {
        aValue = a.company?.name || "";
        bValue = b.company?.name || "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortConfig]);

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function handleAddUser(newUser) {
    dispatch(addUser(newUser));
    setShowAddForm(false);
  }

  function handleUpdateUser(updatedUser) {
    dispatch(updateUser(updatedUser));
    setEditingUser(null);
  }

  function handleDeleteUser(userId) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  }

  function handleSearchChange(event) {
    setSearchInput(event.target.value);
  }

  function getSortIcon(key) {
    if (sortConfig.key !== key) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
              placeholder="Search by name, email or company..."
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

        {editingUser && (
          <div className="mb-6">
            <UpdateUserForm
              user={editingUser}
              onUpdateUser={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        )}

        <div className="mb-4 text-gray-600">
          Showing {sortedUsers.length} of {users.length} users
        </div>

        {sortedUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No users found matching your search.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("email")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {getSortIcon("email")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("company")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Company
                        {getSortIcon("company")}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.map((user) => (
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
                        <div className="flex gap-3">
                          <Link
                            to={`/user/${user.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-green-600 hover:text-green-800 font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
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
