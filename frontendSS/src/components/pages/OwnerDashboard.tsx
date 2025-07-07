import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStorehouses, type Storehouse } from '../../store/slices/storehouseSlice'
import type { RootState, AppDispatch } from '../../store/store'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Building2, Eye } from 'lucide-react'
import CreateStorehouseModal from '../StoreHouseModel'
import StorehouseDetail from './StoreHouse'


const OwnerDashboard = () => {
  const [selectedStorehouse, setSelectedStorehouse] = useState<Storehouse | null>(null)
  const { storehouses, loading } = useSelector((state: RootState) => state.storehouse)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchStorehouses())
  }, [dispatch])

  if (selectedStorehouse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => setSelectedStorehouse(null)}
        >
          ← Back to Storehouses
        </Button>
        <StorehouseDetail storehouse={selectedStorehouse} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Storehouses</h1>
          <CreateStorehouseModal />
        </div>

        {loading ? (
          <p>Loading storehouses...</p>
        ) : storehouses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No storehouses found. Create your first storehouse!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storehouses.map((storehouse) => (
              <Card key={storehouse.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {storehouse.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{storehouse.description}</p>
                  {storehouse.location && (
                    <p className="text-sm text-muted-foreground mb-4">{storehouse.location}</p>
                  )}
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedStorehouse(storehouse)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard