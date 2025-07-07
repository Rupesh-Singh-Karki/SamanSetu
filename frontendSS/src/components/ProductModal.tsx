import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, updateProduct } from '../store/slices/productSlice'
import type { RootState, AppDispatch } from '../store/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const ProductModal = ({ storehouse, product, onClose }: { 
  storehouse: any, 
  product?: any, 
  onClose: () => void 
}) => {
  const [open, setOpen] = React.useState(true)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {}
  })
  const { loading } = useSelector((state: RootState) => state.product)
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (data: any) => {
    try {
      if (product) {
        await dispatch(updateProduct({ id: product.id, ...data }))
      } else {
        await dispatch(createProduct({ ...data, storehouse_id: storehouse.id }))
      }
      setOpen(false)
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_quantity">Total Quantity</Label>
              <Input
                id="total_quantity"
                type="number"
                {...register('total_quantity', { 
                  required: 'Total quantity is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                className="mt-1"
              />
              {errors.total_quantity && (
                <p className="text-sm text-destructive mt-1">{errors.total_quantity.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="price_per_unit">Price per Unit</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.01"
                {...register('price_per_unit', { 
                  required: 'Price is required',
                  min: { value: 0.01, message: 'Must be greater than 0' }
                })}
                className="mt-1"
              />
              {errors.price_per_unit && (
                <p className="text-sm text-destructive mt-1">{errors.price_per_unit.message as string}</p>
              )}
            </div>

            <div> 
              <Label htmlFor="quantity_sold">Sold</Label>
              <Input
                id="quantity_sold"
                type="number"
                step="1"
                {...register('quantity_sold', { 
                  required: 'Sold quantity is required',
                  min: { value: 0, message: 'Must be at least 0' }
                })}
                className="mt-1"
              />
              {errors.quantity_sold && (
                <p className="text-sm text-destructive mt-1">{errors.quantity_sold.message as string}</p>
              )}
            </div>

          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductModal