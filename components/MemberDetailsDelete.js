import React from 'react';

function MemberDetailsDelete({ member, onMemberDeleted }) {
  const handleDelete = () => {
    fetch(`/members/${member._id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        onMemberDeleted(member);
      })
      .catch(error => console.error(error));
  };

  return (
    <div className='container' >
      
      <p>{member.name}?</p>
      <button className='button button1' onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default MemberDetailsDelete;
