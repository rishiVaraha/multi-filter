import { useEffect, useState } from "react";
import "./App.css";
import Pill from "./components/pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const fetchUsers = () => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    fetch(`https://dummyjson.com/user/search?=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectuser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleRemoveUser = (pill) => {
    const updatedUsers = selectedUsers.filter(
      (selectedPill) => selectedPill.id !== pill.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(pill.email);
    setSelectedUserSet(updatedEmails);
  };

  console.log(selectedUsers);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* pills */}

        {selectedUsers.map((pill) => (
          <Pill
            key={pill.email}
            image={pill.image}
            text={`${pill.firstName} ${pill.lastName}`}
            onClick={() => handleRemoveUser(pill)}
          />
        ))}
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search For User..."
          />
        </div>
        {/* search suggestion */}
        <ul className="suggestions-list">
          {suggestions?.users?.map((user) =>
            !selectedUserSet.has(user.email) ? (
              <li key={user.email} onClick={() => handleSelectuser(user)}>
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </li>
            ) : (
              <></>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
