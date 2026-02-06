'use client';

import Image from 'next/image';
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SortField = 'name' | 'category' | 'price' | 'stock' | 'status';
type SortOrder = 'asc' | 'desc';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortOrder: SortOrder;
}

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortOrder: SortOrder;
}

function SortableHeader({ field, children, onSort, sortField, sortOrder }: SortableHeaderProps) {
  const isActive = sortField === field;

  return (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-8 px-2 hover:bg-transparent"
      >
        <span>{children}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  );
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder,
}: ProductTableProps) {
  return (
    <Card className='mt-5 rounded-none'>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <SortableHeader
                  field="name"
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                >
                  Name
                </SortableHeader>
                <SortableHeader
                  field="category"
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                >
                  Category
                </SortableHeader>
                <SortableHeader
                  field="price"
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                >
                  Price
                </SortableHeader>
                <SortableHeader
                  field="stock"
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                >
                  Stock
                </SortableHeader>
                <SortableHeader
                  field="status"
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                >
                  Status
                </SortableHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:block line-clamp-1">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock === 0
                            ? 'destructive'
                            : product.stock < 10
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status ? 'default' : 'secondary'}>
                        {product.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}