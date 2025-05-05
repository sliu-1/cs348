import React, { useState, useEffect } from 'react';
import './modal.css';

const AddPlace = ({ isOpen, closeModal, getPlaces }) => {
  const [newPlace, setNewPlace] = useState({name: '', city: '', state: ''});

  if (!isOpen) return null;

  const addPlace = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/addPlace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPlace)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("New place: " + data.data);
      } else {
        console.error("Error adding place:", data.message);
      }
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  const onSave = async () => {
    await addPlace();
    closeModal();
    await getPlaces();
    setNewPlace({name: '', city: '', state: ''});
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{width: "33vw"}}>
        <div className="modal-title">
          <button className="close-btn" onClick={closeModal}>
            <text>&times;</text>
          </button>
          <div style={{flexGrow: 1, height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
            <text>Add Place</text>
          </div>
          <button style={{ visibility: 'hidden' }}>&times;</button>

        </div>
        <div className="container" style={{height: "30vh"}}>
          <div className="input">
            Name: 
            <input 
              className="name-input"
              placeholder='Name' 
              value={newPlace.name} 
              onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
            />
          </div>

          <div className="input">
            City:
            <input
              className="name-input"
              placeholder='City' 
              value={newPlace.city} 
              onChange={(e) => setNewPlace({...newPlace, city: e.target.value})}
            />
          </div>

          <div className="input">
            State:
            <input
              className="name-input"
              placeholder='State' 
              value={newPlace.state} 
              onChange={(e) => setNewPlace({...newPlace, state: e.target.value})}
            />
          </div>
          <div className="save">
            <button onClick={onSave} disabled={newPlace.name == ''}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;