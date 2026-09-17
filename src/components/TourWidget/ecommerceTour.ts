import type { TourStep } from './types';

export const ecommerceTourSteps: TourStep[] = [
  {
    id: 'step-brand',
    target: '#brand-logo',
    title: 'Welcome to the Store',
    content: 'This demo showcases a modern Vue 3 application. Let us show you around the key features.',
    placement: 'bottom'
  },
  {
    id: 'step-search',
    target: '[data-tour="search-bar"]',
    title: 'Instant Product Search',
    content: 'Type here to search hundreds of products by title, category, or brand with debounced queries.',
    placement: 'bottom'
  },
  {
    id: 'step-category',
    target: '#filter-pop-cta',
    title: 'Category Filtering',
    content: 'Click here to open the category drawer and quickly filter items by category.',
    placement: 'bottom'
  },
  {
    id: 'step-product',
    target: '[data-tour="product-card"]',
    title: 'Product Highlights',
    content: 'Each product card displays star ratings, discount badges, and responsive imagery.',
    placement: 'top'
  },
  {
    id: 'step-cart-add',
    target: '[data-tour="add-to-cart"]',
    title: 'Add to Cart',
    content: 'Quickly add products to your basket with real-time feedback and state tracking.',
    placement: 'top'
  },
  {
    id: 'step-cart',
    target: '#cart-trigger',
    title: 'Order Summary & Cart',
    content: 'Click the cart button anytime to view items, adjust quantities, or simulate checkout.',
    placement: 'bottom'
  },
  {
    id: 'step-pagination',
    target: '#pagination-controls',
    title: 'Virtual Grid & Pagination',
    content: 'Navigate smoothly through the catalog using virtualized rows and page controls.',
    placement: 'top'
  }
];
