# Implementation: Order Value Limit (100M VND)

## Overview
Implemented order value limit checking to prevent customers from placing orders exceeding 100,000,000 VND (100 million VND).

## Changes Made

### 1. Added New State
```javascript
const showOrderLimitExceeded = ref(false)
```

### 2. Modified `handleShowPaymentConfirmation` Function
- Added check for order total before showing payment confirmation
- If total > 100M, show limit exceeded popup instead

### 3. Modified `confirmAndPay` Function  
- Added secondary check as safety measure
- Prevents payment processing if limit exceeded

### 4. Added Popup Component
- Clean modal design with warning styling
- Shows current order total vs limit
- Provides options to close or return to cart

## Logic Flow

1. User clicks "Xác nhận thanh toán" button
2. `handleShowPaymentConfirmation` is triggered
3. Check if `session.totalAmount > 100,000,000`
4. If yes: Show limit exceeded popup
5. If no: Continue with normal validation flow

## Security Features

- Double validation (both in UI trigger and payment confirmation)
- Displays exact amounts for transparency
- Clear policy message for customer understanding

## UI/UX Features

- Professional modal design
- Clear warning icons and colors
- Helpful action buttons (Close, Return to Cart)
- Formatted price display with Vietnamese locale

## Testing

To test this feature:
1. Add items to cart with total value > 100M VND
2. Proceed to checkout
3. Click "Xác nhận thanh toán"
4. Verify popup appears with correct message
5. Verify user cannot proceed with payment

## Technical Details

- Constant: `limitAmount = 100000000` (100M VND)
- Popup triggered by: `showOrderLimitExceeded.value = true`
- Integration with existing modal system and backdrop
- Uses existing `formatPrice` utility for number formatting
