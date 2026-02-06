'use client';

import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { SearchFilter } from '@/components/products/search-filter';
import { ProductTable } from '@/components/products/product-table';
import { ProductCard } from '@/components/products/product-card';
import { ProductForm } from '@/components/products/product-form';
import { DeleteDialog } from '@/components/products/delete-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  useGetAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { ProductFormValues } from '@/lib/validations';

export default function ProductsPage() {
  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch all products (we'll filter client-side)
  const { data: products = [], isLoading, error } = useGetAllProducts(1, 100);

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' || product.status.toString() === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate pagination items
  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return items;
  };

  // Filter handlers - reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // CRUD handlers
  const handleCreateClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateMutation.mutateAsync({
          id: selectedProduct.id,
          data: data,
        });
      } else {
        // Create new product
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await deleteMutation.mutateAsync(selectedProduct.id);
        setIsDeleteOpen(false);
        setSelectedProduct(null);

        // If we deleted the last item on the page, go back one page
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and details
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle - Desktop Only */}
          <div className="hidden items-center gap-1 rounded-lg border p-1 md:flex">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Product Button */}
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <Card className='mt-10'>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive mt-10">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-semibold">Error loading products</p>
              <p className="text-sm">Please try refreshing the page</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      {!isLoading && !error && (
        <>
          {/* Table View */}
          {viewMode === 'table' && (
            <ProductTable
              products={currentProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="flex h-32 items-center justify-center">
                      <p className="text-muted-foreground">No products found.</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-
                {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}{' '}
                products
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {getPaginationItems().map((item, index) => (
                    <PaginationItem key={index} className="hidden sm:block">
                      {item === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(item as number)}
                          isActive={currentPage === item}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Empty State - No products at all */}
          {products.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold">No products yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Get started by adding your first product
                  </p>
                  <Button onClick={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Product Form Modal */}
      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}