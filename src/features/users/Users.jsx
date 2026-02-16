import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchUsers,
  addUserAsync,
  deleteUserAsync,
  updateUserAsync,
} from "./usersSlice";
import {
  canDeleteUser,
  canEditUser,
  canAddUser,
} from "../../utils/permissions";
import "./Users.css";

function Users() {
  const { users, loading, error } = useSelector(
    (state) => state.users
  );

  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingId) {
      dispatch(
        updateUserAsync({
          id: editingId,
          name,
          email,
        })
      );
      setEditingId(null);
    } else {
      dispatch(
        addUserAsync({
          id: Date.now(),
          name,
          email,
        })
      );
    }

    setName("");
    setEmail("");
  };

  const handleEdit = (user) => {
    if (!canEditUser(role)) return;
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="users-container">
      <h2 className="users-title">Users Management</h2>

      {loading && <p>Loading users...</p>}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="user-input"
        style={{ marginBottom: "15px" }}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* 🔥 Form (Hidden for viewer) */}
      {canAddUser(role) && (
        <form
          className="user-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            className="user-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            className="user-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
          />

          <button
            className="user-button"
            type="submit"
            disabled={loading}
          >
            {editingId
              ? "Update User"
              : "Add User"}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {(canEditUser(role) ||
                canDeleteUser(role)) && (
                <th width="180">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  {(canEditUser(role) ||
                    canDeleteUser(role)) && (
                    <td>
                      {canEditUser(role) && (
                        <button
                          className="action-btn edit-btn"
                          onClick={() =>
                            handleEdit(user)
                          }
                          disabled={loading}
                        >
                          Edit
                        </button>
                      )}

                      {canDeleteUser(role) && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() =>
                            dispatch(
                              deleteUserAsync(
                                user.id
                              )
                            )
                          }
                          disabled={loading}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <button
          className="action-btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of{" "}
          {totalPages || 1}
        </span>

        <button
          className="action-btn"
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;
