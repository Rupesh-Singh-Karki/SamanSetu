import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createStorehouse } from '../store/slices/storehouseSlice'
import type { RootState, AppDispatch } from '../store/store'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Plus } from 'lucide-react'

const CreateStorehouseModal = () => {
  const [open, setOpen] = React.useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { loading } = useSelector((state: RootState) => state.storehouse)
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (data: any) => {
    try {
      await dispatch(createStorehouse(data))
      reset()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create storehouse:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Create Storehouse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Storehouse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              className="mt-1"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Storehouse'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateStorehouseModal