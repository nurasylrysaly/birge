import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import MemberDetailsUpdate from '../components/MemberDetailsUpdate';
import MemberDetailsDelete from '../components/MemberDetailsDelete';
import MemberList from '../components/MemberList';
import MemberDetails from '../components/MemberDetails';

function AboutPage() {

    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [members, setMembers] = useState([]);
  
    useEffect(() => {
      fetch('/members')
        .then(response => response.json())
        .then(data => setMembers(data))
        .catch(error => console.error(error));
    }, []);
  
    const handleMemberDeleted = deletedMember => {
      setMembers(members.filter(member => member._id !== deletedMember._id));
    };
  return (
    <div>
      <h1>About Page</h1>
      <Link to="/contact">About</Link>

      <h1 className='route'>4.Update members</h1>
      <MemberList onMemberClick={setSelectedMemberId} />
      {selectedMemberId && <MemberDetailsUpdate id={selectedMemberId} />}

      <h1 className='route'>5.Delete members</h1>
      {members.map(member => (
        <div key={member._id}>
          <MemberDetails member={member} />
          <MemberDetailsDelete member={member} onMemberDeleted={handleMemberDeleted} />
        </div>
      ))}
    </div>
  );
}

export default AboutPage;