import { useState, useEffect } from "react";
import axios from "axios";

function MemberList({ onMemberClick }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const response = await axios.get("/members");
      setMembers(response.data);
    }

    fetchMembers();
  }, []);

  return (
    <div className="container">
      <h1>Member List</h1>
      <ol>
        
      {members.map((member) => (
      <li>
        <div key={member._id}>
          
              <p>{member.name}</p>
            
          <button className="button button1" onClick={() => onMemberClick(member._id)}>View Details</button>
        </div>
        </li>
      ))}
      
      </ol>
    </div>
  );
}

export default MemberList;
