import React, { useState, useEffect } from 'react';
import './modal.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import AddPlace from './addPlace';

const EditModal = ({ id, newFriend, setNewFriend, isOpen, closeModal, getFriends, allFriends }) => {
  const availableFriends = allFriends.filter(friend => friend._id !== id);

  const [place, setPlace] = useState([]);

  const [placeModalOpen, setPlaceModalOpen] = useState(false);

  const updateFriend = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/updateFriend/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({...newFriend, place: newFriend.place?._id})
      });

      const data = await response.json();

      if (data.success) {
        console.log("Updated friend: ");
        console.log(data.data)
        console.log(newFriend)
      } else {
        console.error("Error updating friend:", data.message);
      }
    } catch (error) {
      console.error("Error updating friend:", error);
    }
  };

  const onSave = async () => {
    await updateFriend();
    await getFriends();  
    closeModal();
  };

  const getPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/getPlace");
      const data = await response.json();
    
      setPlace(data.data);

			if (typeof newFriend.place === "string") {
        const selected = place.find(p => p._id === newFriend.place);
        setNewFriend({...newFriend, place: selected})
      } else {
        console.log("It's not a string!");
        console.log(newFriend.place)
      }
      
      if (data.success) {
        console.log(data.data);
      } else {
        console.error("Error fetching places:", data.message);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const deletePlace = async (id) => {
    try {
      const response = await fetch(`http://localhost:8888/api/deletePlace/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setPlace(place.filter(place => place._id !== id));
      } else {
        console.error('Error deleting place', data.message);
      }
      await getPlaces();
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  useEffect(() => {
    getPlaces();
  }, [placeModalOpen, isOpen]);

  
  const closeAddModal = () => {
    setPlaceModalOpen(false);
    getPlaces();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">
          <button className="close-btn" onClick={closeModal}>
            <text>&times;</text>
          </button>
          <div style={{flexGrow: 1, height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
            <text>Edit Friend</text>
          </div>
          <button style={{ visibility: 'hidden' }}>&times;</button>

        </div>
        <div className="container">
          <div className="input">
            Name: 
            <input 
              className="name-input"
              placeholder='Name' 
              value={newFriend.name} 
              onChange={(e) => setNewFriend({...newFriend, name: e.target.value})}
            />
          </div>
          
          <div className="input">
            Closeness: 
            <div className="closeness-input">
              {["Close", "Normal", "New"].map((label, i) => (
                <button
                  key={i}
                  className={newFriend.closeness === label ? "selected" : ""}
                  onClick={() => setNewFriend({...newFriend, closeness: label})}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="input">
            Birthday:
            <input
              type="date"
              className="birthday-input"
              placeholder='Birthday' 
              value={new Date(newFriend.birthday).toISOString().split('T')[0]} 
              onChange={(e) => setNewFriend({...newFriend, birthday: e.target.value})}
            />
          </div>

          <div className="input">
            First met at:
            {place === undefined ? 
              <text style={{color: 'grey'}}>
                No places added yet. Create one here
              </text>
              :
              <select
                placeholder='Place'
                value={newFriend.place?._id || ""}
                onChange={(e) => {
                  const selected = place.find(p => p._id === e.target.value);
                  setNewFriend({ ...newFriend, place: selected });
                }}
              >
                <option value="">-- Select a place --</option>
                {place.map((pla, index) => (
                  <option key={index} value={pla._id}>
                    {pla.name}
                  </option>
                ))}  
              </select>
            }

            <button className='add' onClick={() => setPlaceModalOpen(true)}>
              <AddIcon/>
            </button>
            <button className='add' onClick={() => {
              if (newFriend.place?._id) {
                deletePlace(newFriend.place?._id)
                setNewFriend({ ...newFriend, place: '' });
              }
            }}>
              <DeleteIcon/>
            </button>
          </div>

          <div className="input">
            Likes:
            <input
              className="likes-input"
              placeholder='Likes'
              value={newFriend.likes} 
              onChange={(e) => setNewFriend({...newFriend, likes: e.target.value})}
            />
          </div>

          <div className="input">
            Dislikes:
            <input
              className="dislikes-input"
              placeholder='Dislikes'
              value={newFriend.dislikes} 
              onChange={(e) => setNewFriend({...newFriend, dislikes: e.target.value})}
            />
          </div>

          <div className="input">
            Mutual Friends:

            <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '10px' }}>
              {availableFriends
                .filter(f => newFriend.mutuals.includes(f._id))
                .map(f => (
                  <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{f.name}</span>
                    <button
                      onClick={() =>
                        setNewFriend({ ...newFriend, mutuals: newFriend.mutuals.filter(f_id => f_id !== f._id) })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>

            <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '10px' }}>
              {availableFriends
                .filter(f => !newFriend.mutuals.includes(f._id))
                .map(f => (
                  <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{f.name}</span>
                    <button
                      onClick={() =>
                        setNewFriend({ ...newFriend, mutuals: [...newFriend.mutuals, f._id] })
                      }
                    >
                      +
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div style={{padding: 10}}>
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              className="notes-input"
              rows="5"
              cols="40" 
              placeholder="Enter notes here..."
              value={newFriend.notes}
              onChange={(e) => setNewFriend({...newFriend, notes: e.target.value})}
            />
          </div>
          <div className="save">
            <button onClick={onSave} disabled={newFriend.name == '' || newFriend.closeness == ''}>
              Save
            </button>
          </div>
        </div>
      </div>
      <AddPlace isOpen={placeModalOpen} closeModal={closeAddModal} getPlaces={getPlaces }/>
    </div>
  );
};
  
export default EditModal;