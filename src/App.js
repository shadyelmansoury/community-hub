import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Plus, Building, User, Send, LogOut, LogIn, UserPlus, Grid, List, Eye } from 'lucide-react';

const NeighborManagementTool = () => {
  const [residents, setResidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    zoneId: '',
    buildingId: '',
    unitNumber: '',
    phone: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    zoneId: '',
    buildingId: '',
    unitNumber: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('neighborApp_users') || '[]');
    const savedResidents = JSON.parse(localStorage.getItem('neighborApp_residents') || '[]');
    const savedMessages = JSON.parse(localStorage.getItem('neighborApp_messages') || '[]');
    const savedCurrentUser = localStorage.getItem('neighborApp_currentUser');

    if (savedUsers.length === 0) {
      const demoUsers = [
        { 
          id: 1, 
          email: 'demo@example.com', 
          password: 'demo123', 
          name: 'Demo User', 
          zoneId: 'A', 
          buildingId: '1', 
          unitNumber: '101', 
          phone: '555-0123', 
          joinedDate: '2025-01-01', 
          isOnline: false 
        }
      ];
      setUsers(demoUsers);
      setResidents(demoUsers);
      localStorage.setItem('neighborApp_users', JSON.stringify(demoUsers));
      localStorage.setItem('neighborApp_residents', JSON.stringify(demoUsers));
    } else {
      setUsers(savedUsers);
      setResidents(savedResidents);
      setMessages(savedMessages);
    }
    
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSignUp = () => {
    const { email, password, confirmPassword, name, zoneId, buildingId, unitNumber, phone } = authData;
    
    if (!email || !password || !name || !zoneId || !buildingId || !unitNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (users.find(user => user.email === email)) {
      alert('Email already exists');
      return;
    }
    
    if (residents.find(resident => 
      resident.zoneId === zoneId && 
      resident.buildingId === buildingId && 
      resident.unitNumber === unitNumber
    )) {
      alert('This unit is already registered');
      return;
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      zoneId,
      buildingId,
      unitNumber,
      phone,
      joinedDate: new Date().toLocaleDateString(),
      isOnline: true
    };

    const updatedUsers = [...users, newUser];
    const updatedResidents = [...residents, newUser];
    
    setUsers(updatedUsers);
    setResidents(updatedResidents);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    
    saveToStorage('neighborApp_users', updatedUsers);
    saveToStorage('neighborApp_residents', updatedResidents);
    saveToStorage('neighborApp_currentUser', newUser);
    
    setAuthData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      zoneId: '',
      buildingId: '',
      unitNumber: '',
      phone: ''
    });
  };

  const handleSignIn = () => {
    const { email, password } = authData;
    
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      alert('Invalid email or password');
      return;
    }

    const updatedUser = { ...user, isOnline: true };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    const updatedResidents = residents.map(r => r.id === user.id ? updatedUser : r);
    
    setUsers(updatedUsers);
    setResidents(updatedResidents);
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    
    saveToStorage('neighborApp_users', updatedUsers);
    saveToStorage('neighborApp_residents', updatedResidents);
    saveToStorage('neighborApp_currentUser', updatedUser);
    
    setAuthData({ email: '', password: '', confirmPassword: '', name: '', zoneId: '', buildingId: '', unitNumber: '', phone: '' });
  };

  const handleSignOut = () => {
    if (currentUser) {
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, isOnline: false } : u
      );
      const updatedResidents = residents.map(r => 
        r.id === currentUser.id ? { ...r, isOnline: false } : r
      );
      
      setUsers(updatedUsers);
      setResidents(updatedResidents);
      saveToStorage('neighborApp_users', updatedUsers);
      saveToStorage('neighborApp_residents', updatedResidents);
    }
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('neighborApp_currentUser');
  };

  const handleRegistration = () => {
    if (formData.name && formData.zoneId && formData.buildingId && formData.unitNumber) {
      if (residents.find(r => 
        r.zoneId === formData.zoneId && 
        r.buildingId === formData.buildingId && 
        r.unitNumber === formData.unitNumber
      )) {
        alert('This unit is already registered');
        return;
      }

      const newResident = {
        id: Date.now(),
        ...formData,
        joinedDate: new Date().toLocaleDateString(),
        isOnline: true,
        email: formData.email || currentUser?.email,
        registeredBy: currentUser?.name
      };
      
      const updatedResidents = [...residents, newResident];
      setResidents(updatedResidents);
      saveToStorage('neighborApp_residents', updatedResidents);
      
      setFormData({ name: '', zoneId: '', buildingId: '', unitNumber: '', email: '', phone: '' });
      setShowRegistrationForm(false);
    }
  };

  const getUniqueZones = () => {
    return [...new Set(residents.map(r => r.zoneId))].sort();
  };

  const getUniqueBuildingsInZone = (zoneId) => {
    return [...new Set(residents.filter(r => r.zoneId === zoneId).map(r => r.buildingId))].sort();
  };

  const getAllUniqueBuildings = () => {
    return [...new Set(residents.map(r => `${r.zoneId}-${r.buildingId}`))].sort();
  };

  const getResidentsInBuilding = (zoneId, buildingId) => {
    return residents.filter(r => r.zoneId === zoneId && r.buildingId === buildingId)
      .sort((a, b) => parseInt(a.unitNumber) - parseInt(b.unitNumber));
  };

  const generateBuildingLayout = (buildingResidents) => {
    if (buildingResidents.length === 0) return [];
    
    const unitsPerFloor = new Map();
    
    buildingResidents.forEach(resident => {
      const unitNum = parseInt(resident.unitNumber);
      const floor = Math.floor(unitNum / 100);
      const unitOnFloor = unitNum % 100;
      
      if (!unitsPerFloor.has(floor)) {
        unitsPerFloor.set(floor, []);
      }
      unitsPerFloor.get(floor).push({ ...resident, unitOnFloor, originalUnit: unitNum });
    });
    
    const sortedFloors = Array.from(unitsPerFloor.keys()).sort((a, b) => b - a);
    
    return sortedFloors.map(floor => ({
      floor,
      units: unitsPerFloor.get(floor).sort((a, b) => a.unitOnFloor - b.unitOnFloor)
    }));
  };

  const handleSendMessage = () => {
    if (messageText.trim() && currentUser) {
      const newMessage = {
        id: Date.now(),
        from: currentUser,
        to: messageRecipient,
        message: messageText,
        timestamp: new Date().toLocaleString(),
        read: false
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveToStorage('neighborApp_messages', updatedMessages);
      
      setMessageText('');
      setShowMessageModal(false);
      setMessageRecipient(null);
      alert(`Message sent to ${messageRecipient.name}!`);
    }
  };

  const openMessageModal = (resident) => {
    if (!currentUser) {
      alert('Please sign in first to send messages');
      return;
    }
    setMessageRecipient(resident);
    setShowMessageModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Hub</h1>
            <p className="text-gray-600">Connect with your neighbors</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Demo Account:</strong><br />
              Email: demo@example.com<br />
              Password: demo123
            </p>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                authMode === 'signin' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                authMode === 'signup' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                    <input
                      type="text"
                      value={authData.zoneId}
                      onChange={(e) => setAuthData({...authData, zoneId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Building *</label>
                    <input
                      type="text"
                      value={authData.buildingId}
                      onChange={(e) => setAuthData({...authData, buildingId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <input
                      type="text"
                      value={authData.unitNumber}
                      onChange={(e) => setAuthData({...authData, unitNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="101"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={authData.phone}
                    onChange={(e) => setAuthData({...authData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <button
              onClick={authMode === 'signin' ? handleSignIn : handleSignUp}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 hover:underline font-medium"
              >
                {authMode === 'signin' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building className="text-blue-600 w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Community Hub</h1>
                <p className="text-gray-600">Connect, communicate, and build community</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="text-right mr-4">
                  <p className="font-semibold text-gray-800">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">Zone {currentUser.zoneId} • Unit {currentUser.unitNumber}</p>
                </div>
              )}
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Resident
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Total Residents</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{residents.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="text-green-600 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Active Zones</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{getUniqueZones().length}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="text-purple-600 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Your Messages</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">{messages.filter(m => m.to?.id === currentUser?.id).length}</p>
            </div>
          </div>

          {residents.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <select
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value);
                    setSelectedBuilding('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Zones</option>
                  {getUniqueZones().map(zone => (
                    <option key={zone} value={zone}>Zone {zone}</option>
                  ))}
                </select>
                
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Buildings</option>
                  {selectedZone ? (
                    getUniqueBuildingsInZone(selectedZone).map(building => (
                      <option key={building} value={building}>Building {building}</option>
                    ))
                  ) : (
                    getAllUniqueBuildings().map(building => {
                      const [zone, buildingId] = building.split('-');
                      return (
                        <option key={building} value={buildingId}>Zone {zone} - Building {buildingId}</option>
                      );
                    })
                  )}
                </select>

                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === 'visual' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Building View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Residents Content */}
        <div className="space-y-6">
          {residents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Residents Registered Yet</h3>
              <p className="text-gray-500 mb-6">Add the first resident to start building your community!</p>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Resident
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            getUniqueZones().map(zoneId => {
              if (selectedZone && selectedZone !== zoneId) return null;
              
              return (
                <div key={zoneId} className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Zone {zoneId}</h2>
                  <div className="space-y-6">
                    {getUniqueBuildingsInZone(zoneId).map(buildingId => {
                      if (selectedBuilding && selectedBuilding !== buildingId) return null;
                      
                      const buildingResidents = getResidentsInBuilding(zoneId, buildingId);
                      
                      return (
                        <div key={buildingId} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Building {buildingId}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {buildingResidents.map(resident => (
                              <div key={resident.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <User className="text-gray-600 w-5 h-5" />
                                      {resident.isOnline && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <span className="font-semibold text-gray-800">{resident.name}</span>
                                  </div>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                    Unit {resident.unitNumber}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                  <p>Zone: {resident.zoneId} • Building: {resident.buildingId}</p>
                                  {resident.email && <p>Email: {resident.email}</p>}
                                  {resident.phone && <p>Phone: {resident.phone}</p>}
                                  <p>Joined: {resident.joinedDate}</p>
                                </div>
                                <button
                                  onClick={() => openMessageModal(resident)}
                                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Send Message
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            /* Visual Building View */
            <div className="space-y-8">
              {getUniqueZones().map(zoneId => {
                if (selectedZone && selectedZone !== zoneId) return null;
                
                return (
                  <div key={zoneId} className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Zone {zoneId} - Building Layout</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {getUniqueBuildingsInZone(zoneId).map(buildingId => {
                        if (selectedBuilding && selectedBuilding !== buildingId) return null;
                        
                        const buildingResidents = getResidentsInBuilding(zoneId, buildingId);
                        const buildingLayout = generateBuildingLayout(buildingResidents);
                        
                        if (buildingLayout.length === 0) return null;
                        
                        return (
                          <div key={buildingId} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-200">
                            <div className="text-center mb-4">
                              <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                                <Building className="w-6 h-6 text-blue-600" />
                                Building {buildingId}
                              </h3>
                              <p className="text-sm text-gray-600">{buildingResidents.length} residents</p>
                            </div>
                            
                            <div className="space-y-2">
                              {buildingLayout.map(({ floor, units }) => (
                                <div key={floor} className="bg-white rounded-lg p-3 shadow-sm">
                                  <div className="text-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                      Floor {floor}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                    {units.map(resident => (
                                      <div 
                                        key={resident.id} 
                                        className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => openMessageModal(resident)}
                                      >
                                        <div className="text-center">
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                            <User className="w-4 h-4 text-green-700" />
                                            {resident.isOnline && (
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            )}
                                          </div>
                                          <div className="font-bold text-green-800 text-xs mb-1">
                                            Unit {resident.unitNumber}
                                          </div>
                                          <div className="text-xs text-green-700 font-medium truncate">
                                            {resident.name}
                                          </div>
                                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MessageCircle className="w-3 h-3 mx-auto text-green-600" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 text-center">
                              <div className="text-xs text-gray-600 bg-white rounded-full px-3 py-1 inline-block">
                                <Eye className="w-3 h-3 inline mr-1" />
                                Click any unit to message resident
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Resident</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone ID *</label>
                  <input
                    type="text"
                    value={formData.zoneId}
                    onChange={(e) => setFormData({...formData, zoneId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., A, B, C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building ID *</label>
                  <input
                    type="text"
                    value={formData.buildingId}
                    onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1, 2, 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number *</label>
                  <input
                    type="text"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 101, 102, 203"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleRegistration}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Resident
                  </button>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && messageRecipient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Message</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800">{messageRecipient.name}</p>
                <p className="text-sm text-gray-600">
                  Zone {messageRecipient.zoneId} • Building {messageRecipient.buildingId} • Unit {messageRecipient.unitNumber}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageRecipient(null);
                    setMessageText('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborManagementTool;