import React from 'react'
import { useForm } from 'react-hook-form'  
import { useDispatch, useSelector } from 'react-redux'  
import { loginOwner, loginBuyer } from '../../store/slices/authSlice'
import type { RootState, AppDispatch } from '../../store/store'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label' 
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Login = () => {
  const [userType, setUserType] = React.useState<'owner' | 'buyer'>('owner')
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { loading, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    try {
      if (userType === 'owner') {
        await dispatch(loginOwner(data))
      } else {
        await dispatch(loginBuyer(data))
      }
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={userType === 'owner' ? 'default' : 'outline'}
              onClick={() => setUserType('owner')}
              className="flex-1"
            >
              Owner
            </Button>
            <Button
              variant={userType === 'buyer' ? 'default' : 'outline'}
              onClick={() => setUserType('buyer')}
              className="flex-1"
            >
              Buyer
            </Button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message as string}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login