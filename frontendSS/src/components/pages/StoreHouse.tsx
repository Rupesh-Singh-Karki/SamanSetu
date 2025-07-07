import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByStorehouse, deleteProduct } from '../../store/slices/productSlice'
import type { RootState, AppDispatch } from '../../store/store'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import ProductModal from '../ProductModal'
import { Plus, Edit, Trash2 } from 'lucide-react'

const StorehouseDetail = ({ storehouse }: { storehouse: any }) => {
  const [showProductModal, setShowProductModal] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState(null)
  const { products, loading } = useSelector((state: RootState) => state.product)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProductsByStorehouse(storehouse.id))
  }, [storehouse.id, dispatch])

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(productId))
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowProductModal(true)
  }

  const handleCloseModal = () => {
    setShowProductModal(false)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{storehouse.name}</h2>
          <p className="text-muted-foreground">{storehouse.description}</p>
          {storehouse.location && (
            <p className="text-sm text-muted-foreground">{storehouse.location}</p>
          )}
        </div>
        <Button onClick={() => setShowProductModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">No products found. Create your first product!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>Total: {product.total_quantity}</div>
                        <div>Available: {product.available_quantity}</div>
                        <div>Sold: {product.quantity_sold}</div>
                      </div>
                    </TableCell>
                    <TableCell>${product.price_per_unit}</TableCell>
                    <TableCell>${product.revenue}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showProductModal && (
        <ProductModal
          storehouse={storehouse}
          product={editingProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default StorehouseDetail