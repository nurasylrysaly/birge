import React, { useState } from "react";
import axios from "axios";

function AddMemberForm({ onMemberAdded }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newMember = { name, age: parseInt(age), gender, email };
    const response = await axios.post("/members", newMember);
    fetch("/members",)
    .then((newMember) => {
      console.log(newMember);
      setSuccessMessage("Log in successfully");
      window.location.reload(); // reload the page
    })

    onMemberAdded(response.data);
    setName("");
    setAge("");
    setGender("");
    setEmail("");
  };

  return (
    <div className="container" id="createmembers">
      <form onSubmit={handleSubmit}>
        <h1>CREATE MEMBERS</h1>
        <label><b>Name</b></label>
          <input type="text" placeholder="Enter Name" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <br />
        <label><b>Age</b></label>
          <input type="number" placeholder="Enter Age" name="age" id="age" value={age} onChange={(e) => setAge(e.target.value)} />

        <br />
        <label><b>Gender</b></label>
          <input type="text" placeholder="Enter Gender" name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} />

        <br />
        <label><b>Email</b></label>
          <input type="email" placeholder="Enter Email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <br />
        <button type="submit" class="registerbtn">Add Member</button>
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
}

export default AddMemberForm;
