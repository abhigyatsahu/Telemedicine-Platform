import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Check if the user is already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-primary cursor-pointer hover:text-blue-600">
        Telemedicine
      </h1>

      {/* Desktop Navigation Links */}
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/"><li className="py-1">HOME</li></NavLink>
        <NavLink to="/doctors"><li className="py-1">ALL DOCTORS</li></NavLink>
        <NavLink to="/about"><li className="py-1">ABOUT</li></NavLink>
        <NavLink to="/contact"><li className="py-1">CONTACT</li></NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                <p onClick={handleLogout} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/signup')}
            className="bg-primary text-white px-3 py-1 rounded-full font-light hidden md:block"
          >
            Login/Signup
          </button>
        )}

        {/* Mobile Menu */}
        <img onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
        {showMenu && (
          <div className="fixed inset-0 bg-white z-20 p-6">
            <img src={assets.cross_icon} className="w-7" onClick={() => setShowMenu(false)} alt="" />
            <ul className="flex flex-col mt-5 gap-4 text-lg">
              <NavLink onClick={() => setShowMenu(false)} to="/">HOME</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors">ALL DOCTORS</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">ABOUT</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">CONTACT</NavLink>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

// import React, { useState } from 'react'
// import { assets } from '../assets/assets'
// import { NavLink, useNavigate } from 'react-router-dom'

// const Navbar = () => {

//   const navigate = useNavigate()

//   const [showMenu, setShowMenu] = useState(false)
//   const [token, setToken] = useState(true)

//   return (
//     <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
//       {/* Title */}
//       <h1 onClick={() => navigate('/')} className='text-2xl font-bold text-primary cursor-pointer hover:text-blue-600'>Telemedicine</h1>
//       <ul className='md:flex items-start gap-5 font-medium hidden'>
//         <NavLink to='/' >
//           <li className='py-1'>HOME</li>
//           <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//         </NavLink>
//         <NavLink to='/doctors' >
//           <li className='py-1'>ALL DOCTORS</li>
//           <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//         </NavLink>
//         <NavLink to='/about' >
//           <li className='py-1'>ABOUT</li>
//           <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//         </NavLink>
//         <NavLink to='/contact' >
//           <li className='py-1'>CONTACT</li>
//           <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//         </NavLink>
//       </ul>

//       <div className='flex items-center gap-4 '>
//         {
//           token
//             ?  <button onClick={() => navigate('/signup')} className='bg-primary text-white px-3 py-1 rounded-full font-light hidden md:block'>Login/Signup</button>
//             : 
//             <div className='flex items-center gap-2 cursor-pointer group relative'>
//                 <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
//                 <img className='w-2.5' src={assets.dropdown_icon} alt="" />
//                 <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//                   <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                     <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
//                     <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                     <p onClick={() => { setToken(false); navigate('/') }} className='hover:text-black cursor-pointer'>Logout</p>
//                   </div>
//                 </div>
//             </div>
             
//         }
//         <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

//         {/* ---- Mobile Menu ---- */}
//         <div className={`md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${showMenu ? 'fixed w-full' : 'h-0 w-0'}`}>
//           <div className='flex items-center justify-between px-5 py-6'>
//             <img src={assets.logo} className='w-36' alt="" />
//             <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
//           </div>
//           <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
//             <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
//             <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
//             <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
//             <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Navbar

