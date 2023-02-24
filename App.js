import React, { useState, useEffect } from "react";
import MembersList from './components/MembersList';
import MemberList from './components/MemberList';
import AddMemberForm from './components/AddMemberForm';
import MemberDetails from './components/MemberDetails';
import MemberDetailsUpdate from './components/MemberDetailsUpdate';
import MemberDetailsDelete from './components/MemberDetailsDelete';
import SignupForm from './components/SignupForm';
import Login from './components/Login';
import ScheduleForm from './components/ScheduleForm';
import UploadFile from './components/UploadFile';
import Navbar from './components/Navbar';
import ContentImg from './img/notebook.png'
import MainImg from './img/back-img.png'
import Content2Img from './img/back-img5.png'
import Content3Img from './img/back-img6.png'
import Content4Img from './img/back-img7.png'

function App(){
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [members, setMembers] = useState([]);

  const createSchedule = async (schedule) => {
    const response = await fetch('/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  
    return response.json();
  };
  const handleCreateSchedule = async (schedule) => {
    try {
      const newSchedule = await createSchedule(schedule);
      console.log(newSchedule);
    } catch (error) {
      console.error(error);
    }
  };

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

      <Navbar />

      <div className="main-content">
        <img className="mainImg" src={MainImg} alt="main"/>
        <h2 >The new 1GE fitness center is located in Astana. The futuristic two-story space of 5,000 square meters will amaze you with its beauty and scale, and the variety of training and sports classes will impress even the most sophisticated fitness fan.

Those who prefer the company will like group trainings and balance studio with the most fashionable and effective workouts, those who like solitude will enjoy personal trainings with the best trainers in the city. For strength training there is a huge gym with the latest equipment. After your workout you can relax in the luxurious thermal complex or sit with your favorite book on a lounger by the pool.</h2>
      </div>
 
      <div class="container"> 
      <div class="content">
        <img className="content-img" src={ContentImg} alt="Notebook" />
        <div>
          <h1 >Gym</h1> 
          <p>The gym is more than 1000 sq. m in area and is equipped with a unique lighting system, which transforms the space into a futuristic spaceship. The gym is equipped with the latest line of full muscle group fitness equipment from Hammer Strength and Life Fitness, including Hammer Strength Plate-Loaded disc-loaded machines and the latest Insignia series of Life Fitness machines. The large free weights area features HD Elite base racks for bench presses and squats, power frames and the HD Athletic combination system</p> 
        </div>
        </div> 
      </div> 

      <AddMemberForm />

      <div class="container"> 
      <div class="content">
        <img className="content-img" src={Content2Img} alt="Notebook" />
        <div>
          <h1>Cardio zone</h1> 
          <p>The cardio zone is equipped with the latest line of "smart" fitness equipment from Life fitness: treadmills, running simulators, multifunctional trainers. They recognize club members by their wristbands and start a program selected by an instructor.</p> 
        </div>
        </div> 
      </div> 

      <MembersList />

      <div class="container"> 
      <div class="content">
        <img className="content-img" src={Content3Img} alt="Notebook" />
        <div>
          <h1>Pool</h1> 
          <p>The luxurious 25-meter pool with 5 lanes pleasantly surprises not only with its incredible design and multimedia screen with stylized graphics, but also with a spacious lounge area. Lovers of complex relaxation and recovery in the pool will also enjoy hydromassage and aeromassage.</p> 
        </div>
        </div> 
      </div> 

      <MemberList onMemberClick={setSelectedMemberId} />
      {selectedMemberId && <MemberDetails id={selectedMemberId} />}

      <div class="container"> 
      <div class="content">
        <img className="content-img" src={Content4Img} alt="Notebook" />
        <div>
          <h1>Stretching zone</h1> 
          <p>Functional and strength training perfectly complements the stretching and relaxation space
            , which is so necessary for shaping an ideal body shape. The mats and a large selection of fitness 
            accessories allow for a circuit training session for every taste.</p> 
        </div>
        </div> 
      </div> 


      <MemberList onMemberClick={setSelectedMemberId} />
      {selectedMemberId && <MemberDetailsUpdate id={selectedMemberId} />}

      <h1 className='route'>Delete members</h1>
      {members.map(member => (
        <div key={member._id}>
          <MemberDetails member={member} />
          <MemberDetailsDelete member={member} onMemberDeleted={handleMemberDeleted} />
        </div>
      ))}

      <SignupForm />

      <Login />

      
      <ScheduleForm onCreateSchedule={handleCreateSchedule} />

      <UploadFile />

      

    </div>
  );
}

export default App;
