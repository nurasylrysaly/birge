import { useState, useEffect } from "react";
import axios from "axios";

function MemberDetailsUpdate({ id }) {
  const [member, setMember] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchMember() {
      const response = await axios.get(`/members/${id}`);
      setMember(response.data);
      setName(response.data.name);
      setAge(response.data.age);
      setGender(response.data.gender);
      setEmail(response.data.email);
    }

    fetchMember();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedMember = {
      name,
      age,
      gender,
      email,
      joinDate: member.joinDate, // keep the joinDate the same as the original member
    };
    const response = await axios.put(`/members/${id}`, updatedMember);
    setMember(response.data);
  };

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Member Details</h1>
      <p>Name: {member.name}</p>
      <p>Age: {member.age}</p>
      <p>Gender: {member.gender}</p>
      <p>Email: {member.email}</p>
      <p>Join Date: {member.joinDate}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <button class="button button1" type="submit">Update Member</button>
      </form>
    </div>
  );
}

export default MemberDetailsUpdate;