import { useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store/store"   
import { logout } from "../../store/slices/authSlice"
import { Button } from "../ui/button"   
import { User, LogOut, Menu, X, Sun, Moon, Search } from "lucide-react"
import { Badge } from "../ui/badge"
import type { AppDispatch } from "../../store/store"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from '../context/ThemeContext';
import { Warehouse } from 'lucide-react';
import { Input } from "../ui/input"

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="border-b bg-card w-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          SamanSetu
        </Link>

        {/* Search Bar - Desktop */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                user && user.role === 'owner'
                  ? 'Search products or storehouses...'
                  : 'Search products... '
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {user ? (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-2">
                <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  Home
                </Link>
                <Link 
                  to={user.role === 'owner' ? "../owner/dashboard" : "../buyer/dashboard"} 
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  {user.role === 'owner' ? 'Storehouses' : 'Marketplace'}
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </Button>
                
                <div className="flex items-center gap-2 border-l pl-4">
                  <div className="bg-accent p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[120px]">{user.email}</p>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="hidden sm:flex">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-card border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products or storehouses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <Link 
              to="/" 
              className="px-3 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to={user.role === 'owner' ? "../owner/dashboard" : "../buyer/dashboard"} 
              className="px-3 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {user.role === 'owner' ? 'Storehouses' : 'Marketplace'}
            </Link>
            
            <div className="pt-4 mt-2 border-t flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-accent p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header