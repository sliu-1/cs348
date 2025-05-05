import React, { useState, useEffect } from 'react';
import './modal.css';
    
const FilterModal = ({ isOpen, closeModal, setFriends, closeness, setCloseness, startDate, setStartDate, endDate, setEndDate, place, setPlace}) => {    
  const [places, setPlaces] = useState([]);

  const getFiltered = async () => {
    const params = new URLSearchParams();
  
    if (closeness) 
      params.append("closeness", closeness);
    if (startDate) 
      params.append("startDate", startDate);
    if (endDate) 
      params.append("endDate", endDate);
    if (place) 
      params.append("place", place._id);

    console.log(params)
  
    const response = await fetch(`http://localhost:8888/api/filterFriends?${params.toString()}`);
    const data = await response.json();
  
    if (data.success) {
      setFriends(data.data);

      console.log("SUCCESS")
      console.log(data.data);
    } else {
      console.error("Error:", data.message);
    }
  };
  
  const getPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/getPlace");
      const data = await response.json();

      console.log("here is the places")
  
      setPlaces(data.data);
      
      if (data.success) {
        console.log(data.data);
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

  const onFilter = async () => {
    await getFiltered();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">
          <button className="close-btn" onClick={closeModal}>
            <text>&times;</text>
          </button>
          <div style={{flexGrow: 1, height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
            <text>Filters</text>
          </div>
          <button style={{ visibility: 'hidden' }}>&times;</button>

        </div>
        <div className="container">
          <div className="input">
            Closeness: 
            <div className="closeness-input">
              {["Close", "Normal", "New"].map((label, i) => (
                <button
                  key={i}
                  className={closeness === label ? "selected" : ""}
                  onClick={() => setCloseness(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="input">
            Birthday Range:
            <input
              type="date"
              className="birthday-input"
              value={startDate || new Date().toISOString().split('T')[0]} 
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="birthday-input"
              value={endDate || new Date().toISOString().split('T')[0]} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="input">
            First met at:
            {places === undefined ? 
              <text style={{color: 'grey'}}>
                No places added yet. Create one here
              </text>
              :
              <select
                placeholder='Place'
                value={place?._id || ""}
                onChange={(e) => {
                  const selected = places.find(p => p._id === e.target.value);
                  setPlace(selected);
                }}
              >
                <option value="">-- Select a place --</option>
                {places.map((pla, index) => (
                  <option key={index} value={pla._id}>
                    {pla.name}
                  </option>
                ))}  
              </select>
            }
          </div>

          <div className="save">
            <button onClick={onFilter}>
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
      
export default FilterModal;