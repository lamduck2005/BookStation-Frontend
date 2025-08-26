# Policy Link Enhancement for Order Limit Popup

## Overview
Enhanced the order limit exceeded popup to include clickable policy links that open the policy preview modal.

## Changes Made

### 1. Updated Popup Content
- Made "chính sách" text clickable
- Added two clickable policy links in the popup message
- Both links trigger `showPolicyPreview = true`

### 2. Updated Backdrop Logic
- Added `showPolicyPreview` to backdrop condition
- Allows both popups to display simultaneously

### 3. Z-Index Adjustments
- Order limit popup: z-index 1050
- Policy preview modal: z-index 1060 (appears on top)

### 4. Enhanced Styling
- Added hover effects for policy links
- Smooth transitions and background highlight
- Professional link styling with underlines

## User Experience Flow

1. User exceeds 100M order limit
2. Order limit popup appears with warning message
3. User can click on "chính sách" or "chính sách đặt hàng" links
4. Policy preview modal opens on top of limit popup
5. User can read policies without losing context
6. User can close policy modal and return to limit popup
7. Or close both and return to checkout

## Technical Details

### Links Added
```vue
<a 
  href="#" 
  class="text-primary text-decoration-underline fw-bold"
  @click.prevent="showPolicyPreview = true"
>
  chính sách
</a>
```

### CSS Enhancements
```css
.alert a.text-primary {
  transition: all 0.2s ease;
}

.alert a.text-primary:hover {
  color: #0056b3 !important;
  text-decoration: none !important;
  background-color: rgba(13, 110, 253, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
}
```

## Benefits
- Better user experience with easy access to policies
- Maintains context while providing detailed information  
- Professional UI with smooth interactions
- Clear call-to-action for policy compliance
