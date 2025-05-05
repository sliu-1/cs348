import React, { useState, useEffect } from 'react';
import './modal.css';

const DetailModal = ({ id, friend, setFriend, isOpen, closeModal, allFriends, openEditModal }) => {

  const availableFriends = allFriends.filter(f => f._id !== id);

  const onEdit = async () => {
		openEditModal(friend)
  };

  const getPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/getPlace");
      const data = await response.json();
    
			if (typeof friend.place === "string") {
				console.log("It's a string!");
        console.log(friend.place)
				console.log(data.data)
				const selected = data.data.find(p => p._id === friend.place);
				console.log("selected")
				console.log(selected)
				await setFriend({...friend, place: selected})
				console.log(friend.place)
      } else {
        console.log("It's not a string!");
        console.log(friend.place)
      }
      
      if (data.success) {
        console.log(data.data);
				console.log(friend.place)
      } else {
        console.error("Error fetching places:", data.message);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

	
	useEffect(() => {
		getPlaces();
	}, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-1">
      <div className="modal-content">
        <div className="modal-title">
          <button className="close-btn" onClick={closeModal}>
            <text>&times;</text>
          </button>
          <div style={{flexGrow: 1, height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
            <text>Friend Details</text>
          </div>
          <button style={{ visibility: 'hidden' }}>&times;</button>

        </div>
        <div className="container">
          <div className="input">
            Name: 
						<div className='details'>
							{friend.name}
						</div>
          </div>
          
          <div className="input">
            Closeness: 
            <div className="closeness-input">
              {["Close", "Normal", "New"].map((label, i) => (
                <button
                  key={i}
                  className={friend.closeness === label ? "selected" : ""}
                  disabled
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="input">
            Birthday:
						{
							friend.birthday ?
							<div className="details">
								{new Date(friend.birthday).toISOString().split('T')[0]}
							</div> :
							<div className="details-empty">
								Birthday
							</div>
						}
          </div>

          <div className="input">
            First met at:
						{
							friend.place ?
							<div className="details">
								{friend.place?.name || ""}
							</div> :
							<div className="details-empty">
								Place
							</div>
						}
          </div>

          <div className="input">
            Likes:
						{
							friend.likes ? 
							<div className='details'>
								{friend.likes}
							</div> :
							<div className='details-empty'>
								Likes
							</div>
						}
          </div>

          <div className="input">
            Dislikes:
            {
							friend.dislikes ? 
							<div className='details'>
								{friend.dislikes}
							</div> :
							<div className='details-empty'>
								Dislikes
							</div>
						}
          </div>

          <div className="input">
            Mutual Friends:

            <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '10px' }}>
              {availableFriends
                .filter(f => friend.mutuals.includes(f._id))
                .map(f => (
                  <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{f.name}</span>

                  </div>
                ))}
            </div>
          </div>

          <div style={{padding: 10}}>
            <label htmlFor="notes">Notes:</label>
            <textarea
							style={{color: 'black'}}
              id="notes"
              className="notes-input"
              rows="5"
              cols="40" 
              placeholder="Enter notes here..."
              value={friend.notes}
							disabled
            />
          </div>
          <div className="save">
            <button onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default DetailModal;