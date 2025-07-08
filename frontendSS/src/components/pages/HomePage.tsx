import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Warehouse, ShoppingCart, BarChart, Users, Mail, CheckCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { useEffect, useState } from 'react'

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="bg-card p-6 rounded-xl border hover:border-primary transition-all">
    <div className="bg-primary/10 p-3 rounded-lg w-max mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

function HomePage() {
  const { theme } = useTheme()
  const { user } = useSelector((state: RootState) => state.auth)
  const location = useLocation() // Add location hook
  const [showWelcome, setShowWelcome] = useState(false) // Add state for welcome message

   // Show welcome message if redirected from signup/login
  useEffect(() => {
    if (location.state?.showWelcome) {
      setShowWelcome(true);
      // Clear state to prevent showing again on refresh
      const state = { ...location.state };
      delete state.showWelcome;
      window.history.replaceState(state, '', location.pathname);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen">
      {showWelcome && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
          Welcome to SamanSetu! 🎉 <br /> Please login if you just signed up 
        </div>
      )}
      {/* Hero Section */}
      <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-primary/10 to-background' : 'bg-gradient-to-b from-primary/5 to-background'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Connect Farmers & Buyers with 
                <span className="text-primary"> SamanSetu</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Nepal's premier agricultural marketplace connecting farmers directly with buyers
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <p className="text-lg">Welcome back, {user.email}!</p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link to={user.role === 'owner' ? "/owner/dashboard" : "/buyer/dashboard"}>
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">
                        Explore Marketplace
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-card p-8 rounded-xl border">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <Warehouse className="h-10 w-10 text-primary" />
                  <h3 className="font-bold mt-4">Storehouses</h3>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg mt-8">
                  <ShoppingCart className="h-10 w-10 text-primary" />
                  <h3 className="font-bold mt-4">Marketplace</h3>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg">
                  <BarChart className="h-10 w-10 text-primary" />
                  <h3 className="font-bold mt-4">Analytics</h3>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg mt-8">
                  <Users className="h-10 w-10 text-primary" />
                  <h3 className="font-bold mt-4">Community</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SamanSetu Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies agricultural commerce with powerful tools for both farmers and buyers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Warehouse className="h-8 w-8 text-primary" />}
              title="Manage Storehouses"
              description="Easily organize and track your agricultural products across multiple storage locations"
            />
            
            <FeatureCard 
              icon={<ShoppingCart className="h-8 w-8 text-primary" />}
              title="Marketplace Access"
              description="Connect directly with buyers and sellers in Nepal's agricultural supply chain"
            />
            
            <FeatureCard 
              icon={<BarChart className="h-8 w-8 text-primary" />}
              title="Inventory Analytics"
              description="Track sales, inventory levels, and revenue with comprehensive dashboards"
            />
            
            <FeatureCard 
              icon={<Mail className="h-8 w-8 text-primary" />}
              title="Direct Messaging"
              description="Communicate securely with potential buyers or sellers"
            />
            
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Quality Assurance"
              description="Verified products with quality ratings from trusted farmers"
            />
            
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Community Network"
              description="Join Nepal's largest agricultural community of farmers and buyers"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Agricultural Business?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and buyers already using SamanSetu to streamline their agricultural operations
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage