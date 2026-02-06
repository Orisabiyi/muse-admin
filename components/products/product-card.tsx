'use client';

import Image from 'next/image';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div
        className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted"
        onClick={() => onView(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
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
        </div>
      </div>

      <div onClick={() => onView(product)} className="cursor-pointer">
        <CardHeader className="space-y-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
            <Badge variant={product.status ? 'default' : 'secondary'} className="shrink-0">
              {product.status ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${product.price}</p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  product.stock === 0
                    ? 'destructive'
                    : product.stock < 10
                      ? 'secondary'
                      : 'outline'
                }
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : product.stock < 10
                    ? `${product.stock} left`
                    : `${product.stock} in stock`}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4">
          <Badge variant="outline" className="w-full justify-center">
            {product.category}
          </Badge>
        </CardFooter>
      </div>
    </Card>
  );
}