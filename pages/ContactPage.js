import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import MembersList from '../components/MembersList';
import MemberList from '../components/MemberList';
import AddMemberForm from '../components/AddMemberForm';
import MemberDetails from '../components/MemberDetails';


function ContactPage() {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [members, setMembers] = useState([]);
  
    useEffect(() => {
      fetch('/members')
        .then(response => response.json())
        .then(data => setMembers(data))
        .catch(error => console.error(error));
    }, []);
  return (
    <div>
      <h1>Contact Page</h1>
      <Link to="/">About</Link>

      <h1 className='route'>1.Create members</h1>
      <AddMemberForm />

      <h1 className='route'>2.Get members</h1>
      <MembersList />

      <h1 className='route'>3.Get members by ID</h1>
      <MemberList onMemberClick={setSelectedMemberId} />
      {selectedMemberId && <MemberDetails id={selectedMemberId} />}
    </div>
  );
}

export default ContactPage;