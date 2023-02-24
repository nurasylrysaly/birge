import React, { useState, useEffect } from "react";
import axios from "axios";

function MembersList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const response = await axios.get("/members");
      setMembers(response.data);
    }
    fetchMembers();
  }, []);

  return (
    <div className="container" id="getmembers">
      <h1>Gym Members</h1>
      <ol>
        {members.map((member) => (
          <li key={member._id}>
            <h2>{member.name}</h2>
            <p>Age: {member.age}</p>
            <p>Gender: {member.gender}</p>
            <p>Email: {member.email}</p>
            <p>Join Date: {member.joinDate}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default MembersList;
