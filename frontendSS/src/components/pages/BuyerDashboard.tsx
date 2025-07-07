import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../../store/slices/productSlice'
import type { RootState, AppDispatch } from '../../store/store'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Package, Mail, MessageCircle } from 'lucide-react'
import InquiryModal from '../inquiryModal'
import { Badge } from '../ui/badge'

const BuyerDashboard = () => {
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)
  const { allProducts, loading } = useSelector((state: RootState) => state.product)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const handleSendInquiry = (product: any) => {
    setSelectedProduct(product)
    setShowInquiryModal(true)
  }

  const handleCloseInquiryModal = () => {
    setShowInquiryModal(false)
    setSelectedProduct(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Product Marketplace</h1>
          <Badge variant="outline" className="text-sm">
            {allProducts.length} Products Available
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading products...</p>
          </div>
        ) : allProducts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No products available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Available Qty</TableHead>
                    <TableHead>Price per Unit</TableHead>
                    <TableHead>Storehouse</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={product.description}>
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.available_quantity > 0 ? "default" : "destructive"}>
                          {product.available_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>${product.price_per_unit}</TableCell>
                      <TableCell>
                        {product.storehouse ? product.storehouse.name : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {product.owner ? product.owner.email : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendInquiry(product)}
                          disabled={product.available_quantity === 0}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Inquire
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {showInquiryModal && selectedProduct && (
        <InquiryModal
          product={selectedProduct}
          onClose={handleCloseInquiryModal}
        />
      )}
    </div>
  )
}

export default BuyerDashboard
// This component displays a dashboard for buyers, showing available products and allowing them to send inquiries about products.