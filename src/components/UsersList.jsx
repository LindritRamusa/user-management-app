import React, { use } from "react";
import { useState, useEffect } from "react";
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

 
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
  if(error){
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {users.map((user)=>(
        <div key={user.id}>
          {user.name}
          {user.email}
          {user.company?.name || 'N/A'}
          {user.id}
        </div>
      ))}
    </div>
  )
}

export default UsersList;
