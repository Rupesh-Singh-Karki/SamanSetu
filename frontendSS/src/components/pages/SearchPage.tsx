import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { searchProducts } from '../../store/slices/productSlice'
import { searchStorehouses } from '../../store/slices/storehouseSlice'
import type { Product } from '../../store/slices/productSlice'
import type { Storehouse } from '../../store/slices/storehouseSlice'
import type { RootState } from '../../store/store'

// Define a union type for search results
type SearchResult = 
  | (Product & { type: 'product' })
  | (Storehouse & { type: 'storehouse' })

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  // Extract search query from URL
  const query = new URLSearchParams(location.search).get('q') || ''

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (query) {
      setLoading(true)
      setSearchResults([])

      // Perform search based on user role
      if (user.role === 'buyer') {
        // Buyers can only search products
        dispatch(searchProducts(query) as any)
          .then((action: any) => {
            if (searchProducts.fulfilled.match(action)) {
              setSearchResults(action.payload.map((p: Product) => ({ ...p, type: 'product' })))
            }
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
      } else if (user.role === 'owner') {
        // Owners can search both products and storehouses
        Promise.all([
          dispatch(searchProducts(query) as any),
          dispatch(searchStorehouses(query) as any)
        ])
          .then(([productsAction, storehousesAction]) => {
            const products = searchProducts.fulfilled.match(productsAction) 
              ? productsAction.payload.map((p: Product) => ({ ...p, type: 'product' }))
              : [];
              
            const storehouses = searchStorehouses.fulfilled.match(storehousesAction) 
              ? storehousesAction.payload.map((s: Storehouse) => ({ ...s, type: 'storehouse' }))
              : [];
            
            setSearchResults([...products, ...storehouses])
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
      }
    } else {
      navigate('/')
    }
  }, [query, user, dispatch, navigate])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product') {
      navigate(`/product/${result.id}`)
    } else {
      // Navigate to storehouse page with its products
      navigate(`/storehouse/${result.id}/products`)
    }
  }

  // Helper function to get available quantity for products
  const getAvailableQuantity = (product: Product) => {
    return product.total_quantity - product.quantity_sold
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Search className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">
            Search Results for: <span className="text-primary">"{query}"</span>
          </h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p>Searching...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any products or storehouses matching your search
              </p>
              <Button className="mt-4" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow 
                      key={`${result.type}-${result.id}`} 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleResultClick(result)}
                    >
                      <TableCell>
                        <Badge variant={result.type === 'product' ? 'default' : 'secondary'}>
                          {result.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.description || 'No description'}</TableCell>
                      <TableCell>
                        {result.type === 'product' ? (
                          <div>
                            <div>Price: ${result.price_per_unit}</div>
                            <div>Available: {getAvailableQuantity(result)}</div>
                          </div>
                        ) : (
                          <div>{result.location || 'No location specified'}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SearchPage