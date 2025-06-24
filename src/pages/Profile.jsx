import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../styles/home.css'; 

const Profile = () => {
  const [user, setUser ] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser (response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      // Update profile details
      await axios.put(
        '/api/profile/update',
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update profile picture if selected
      if (profilePic) {
        const formDataPic = new FormData();
        formDataPic.append('profilePic', profilePic);
        await axios.post('/api/profile/upload-pic', formDataPic, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Refresh profile data
      setUser (formData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="container mt-5 profile-container">
      <h2 className="text-center">My Profile</h2>
      {user ? (
        <>
          <div className="text-center mb-4">
            <img
              src={user.profilePic || '/default-profile.png'}
              alt="Profile"
              className="profile-pic"
            />
          </div>
          {editMode ? (
            <div className="profile-form">
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className="form-control mb-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="form-control mb-2"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter Phone"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="form-control mb-2"
              />
              <input type="file" onChange={handleProfilePicChange} className="form-control mb-2" />
              <button className="btn mb-4 mt-2 btn-success" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn mb-4 mt-2 btn-secondary ms-2" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="profile-info text-center">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <button className="btn mb-4 btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;