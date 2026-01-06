import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Key } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="flex w-full h-screen bg-[#f3f4f6] items-center justify-center px-4 md:px-8">
      <div className="flex w-full max-w-4xl h-[550px] rounded-2xl overflow-hidden shadow-2xl">

        {/* Left Section */}
        <div className="hidden md:flex flex-1 bg-[#6a8795] items-center justify-center p-12">
          <h1 className="text-white text-5xl font-extrabold text-center leading-tight tracking-wide">
            HELLO ADMIN,<br />WELCOME
          </h1>
        </div>

        {/* Right Section */}
        <div className="w-full md:flex-1 bg-[#d0e8e5] flex flex-col items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="flex items-center gap-6 mb-24">
              <div className="w-11 h-11 bg-[#1f9e9a] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h1 className="text-2xl font-black text-[#333333] leading-none uppercase tracking-tighter">
                Smart Waste<br />Admin
              </h1>
            </div>
            

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Username */}
              <div className="group relative flex items-center">
                {/* Icon Container - Forced to the left */}
                <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
                  <User
                    size={22}
                    className="text-gray-400 group-focus-within:text-[#1f9e9a] transition-colors"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Username or Phone Number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // Using inline style for padding-left to guarantee it overrides everything
                  style={{ paddingLeft: '60px' }}
                  className="w-full h-[55px] pr-4 text-lg bg-white border border-gray-300 rounded-2xl outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#1f9e9a]/30 focus:border-[#1f9e9a] transition-all"
                />
              </div>

              {/* Password */}
              <div className="group relative flex items-center">
                <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
                  <Key
                    size={22}
                    className="text-gray-400 group-focus-within:text-[#1f9e9a] transition-colors"
                  />
                </div>

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Forced padding
                  style={{ paddingLeft: '60px' }}
                  className="w-full h-[55px] pr-4 text-lg bg-white border border-gray-300 rounded-2xl outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#1f9e9a]/30 focus:border-[#1f9e9a] transition-all"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="bg-[#1f9e9a] hover:bg-[#198a87] text-white font-extrabold h-[55px] rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg mt-4 text-xl active:scale-[0.98]"
              >
                Login
              </button>

            </form>
            <div className="h-2"></div>
            {/* Footer */}
            <div className="text-center mt-10">
              <a
                href="#forgot"
                className="text-[#1f9e9a] hover:text-[#198a87] text-sm font-semibold hover:underline underline-offset-4 transition-all"
              >
                Forgot password? Receive an OTP
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
