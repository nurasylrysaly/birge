import { useState, useEffect } from "react";
import axios from "axios";

function MemberDetails({ id }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    async function fetchMember() {
      const response = await axios.get(`/members/${id}`);
      setMember(response.data);
    }

    fetchMember();
  }, [id]);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Member Details Individual</h1>
      <p>Name: {member.name}</p>
      <p>Age: {member.age}</p>
      <p>Gender: {member.gender}</p>
      <p>Email: {member.email}</p>
      <p>Join Date: {member.joinDate}</p>
    </div>
  );
}

export default MemberDetails;