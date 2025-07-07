import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createInquiry } from '../store/slices/inquirySlice'
import type { RootState, AppDispatch } from '../store/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const InquiryModal = ({ product, onClose }: { product: any, onClose: () => void }) => {
  const [open, setOpen] = React.useState(true)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { loading } = useSelector((state: RootState) => state.inquiry)
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (data: any) => {
    try {
      await dispatch(createInquiry({
        product_id: product.id,
        message: data.message,
        quantity: parseInt(data.quantity)
      }))
      setOpen(false)
      onClose()
    } catch (error) {
      console.error('Failed to send inquiry:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Inquiry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <p className="text-sm">Price: ${product.price_per_unit} per unit</p>
            <p className="text-sm">Available: {product.available_quantity} units</p>
            {product.owner && (
              <p className="text-sm">Owner: {product.owner.email}</p>
            )}
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity Needed</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: product.available_quantity, message: `Cannot exceed ${product.available_quantity}` }
                })}
                className="mt-1"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive mt-1">{errors.quantity.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register('message', { required: 'Message is required' })}
                className="mt-1"
                placeholder="Please provide details about your inquiry..."
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message.message as string}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InquiryModal