import './App.css';
import { useState, useEffect } from 'react';
import AddModal from './components/addModal';
import EditModal from './components/editModal';

function App() {

  const [friends, setFriends] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [friend, setFriend] = useState({});

  useEffect(() => {
    if (!isEditModalOpen) {
      getFriends();
    }
  }, [isEditModalOpen]);

  const getFriends = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/getFriend");
      const data = await response.json();

      console.log("data:" + data)

      setFriends(data.data);
      
      if (data.success) {
        console.log(data.data);
      } else {
        console.error("Error fetching friends:", data.message);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const openModal = () => {
    console.log("modal is opened");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getFriends();
  };

  const openEditModal = (friend) => {
    setFriend({ ...friend, birthday: new Date(friend.birthday) });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    getFriends();
  };

  const deleteFriend = async (id) => {
    try {
      const response = await fetch(`http://localhost:8888/api/deleteFriend/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setFriends(friends.filter(friend => friend._id !== id));
      } else {
        console.error('Error deleting friend', data.message);
      }
      await getFriends();
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  return (
    <div className="App">
      <div className="App-body">
        <div className="Friend">
          <div className="AddFriend">
            <button onClick={openModal} className="Button">
              Add friend
            </button>
          </div>
          <div className="Title">
            <text>
              Friends
            </text>
          </div>
          <div className="AddFriend">
            <button className="Button">
              Filter
            </button>
          </div>
        </div>
        {friends == undefined || 
          <div className="Container">
            <div className="Friends-Container">
              <text style={{paddingBottom: 20}}>Close Friends</text>
              <div className="Friends-list">
                {friends.filter(friend => friend.closeness == "Close").map(friend => (
                  <div key={friend._id} className='Friends-item'>
                    {friend.name}
                    <button onClick={() => openEditModal(friend)}>edit</button>
                    <button onClick={() => deleteFriend(friend._id)}>delete</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="Friends-Container">
              <text>Normal Friends</text>
              <div className="Friends-list">
                {friends.filter(friend => friend.closeness == "Normal").map(friend => (
                  <div key={friend._id} className='Friends-item'>
                    {friend.name}
                    <button onClick={() => openEditModal(friend)}>edit</button>
                    <button onClick={() => deleteFriend(friend._id)}>delete</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="Friends-Container">
              <text>New Friends</text>
              <div className="Friends-list">
                {friends.filter(friend => friend.closeness == "New").map(friend => (
                  <div key={friend._id} className='Friends-item'>
                    {friend.name}
                    <button onClick={() => openEditModal(friend)}>edit</button>
                    <button onClick={() => deleteFriend(friend._id)}>delete</button>
                  </div>
                ))}
              </div>
              </div>
          </div>
        }
      </div>
      <EditModal id={friend._id} newFriend={friend} setNewFriend={setFriend} isOpen={isEditModalOpen} closeModal={closeEditModal} getFriends={getFriends} allFriends={friends}/>
      <AddModal isOpen={isModalOpen} closeModal={closeModal} getFriends={getFriends} allFriends={friends}/>
    </div>
  );
}

export default App;
