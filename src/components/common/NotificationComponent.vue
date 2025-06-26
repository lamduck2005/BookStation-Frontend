<template>
    <div class="notification-component" :class="componentClasses">
        <!-- Notification Bell Icon (chỉ hiển thị khi mode là dropdown) -->
        <div v-if="mode === 'dropdown'" 
             class="notification-trigger d-flex flex-column align-items-center text-decoration-none text-dark position-relative" 
             @click="toggleDropdown" 
             ref="trigger">
            <i class="bi bi-bell fs-5"></i>
            <small class="text-muted" style="font-size: 11px;">Thông Báo</small>
            <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                  style="font-size: 9px;">{{ unreadCount }}</span>
        </div>

        <!-- Notification Panel -->
        <div v-if="shouldShowPanel" class="notification-panel" :class="panelClasses" ref="dropdown">
            <!-- Header -->
            <div class="notification-header">
                <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 class="mb-0 fw-bold" :class="titleClass">{{ title }}</h6>
                    <button class="btn btn-sm btn-outline-secondary" @click="markAllAsRead">
                        Đánh dấu đã đọc
                    </button>
                </div>
                
                <!-- Tab navigation -->
                <div class="notification-tabs d-flex">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.key"
                        class="tab-btn flex-fill py-2 border-0 bg-transparent"
                        :class="{ 'active': activeTab === tab.key }"
                        @click="setActiveTab(tab.key)">
                        {{ tab.label }}
                        <span v-if="tab.hasNotification" class="notification-dot"></span>
                    </button>
                </div>
            </div>

            <!-- Notification content -->
            <div class="notification-content" :style="contentStyle">
                <div v-if="paginatedNotifications.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-bell-slash fs-1 text-muted"></i>
                    <p class="mt-2">Không có thông báo nào</p>
                </div>
                
                <div v-else class="notification-list">
                    <div 
                        v-for="notification in paginatedNotifications" 
                        :key="notification.id"
                        class="notification-item p-3 border-bottom position-relative"
                        :class="{ 'unread': !notification.isRead }"
                        @click="markAsRead(notification.id)">
                        
                        <div class="d-flex gap-3">
                            <!-- Icon -->
                            <div class="notification-icon">
                                <div class="rounded-circle d-flex align-items-center justify-content-center" 
                                     :class="getIconBgClass(notification.type)"
                                     style="width: 45px; height: 45px;">
                                    <i :class="getNotificationIcon(notification.type)"></i>
                                </div>
                            </div>
                            
                            <!-- Content -->
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="notification-title mb-1 fw-semibold" :class="getTitleClass(notification.type)">
                                        {{ notification.title }}
                                    </h6>
                                    <small class="text-muted notification-time">{{ notification.time }}</small>
                                </div>
                                
                                <p class="notification-message text-muted mb-2 small">
                                    {{ notification.message }}
                                </p>
                                
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge rounded-pill" :class="getCategoryBadgeClass(notification.category)">
                                        {{ getCategoryLabel(notification.category) }}
                                    </span>
                                    <span v-if="!notification.isRead" class="unread-indicator"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination (chỉ hiển thị ở mode fullsize) -->
            <div v-if="mode === 'fullsize' && totalPages > 1" class="notification-pagination p-3 border-top">
                <nav aria-label="Notifications pagination">
                    <ul class="pagination pagination-sm justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        
                        <li v-for="page in visiblePages" :key="page" class="page-item" 
                            :class="{ active: page === currentPage, disabled: page === '...' }">
                            <button v-if="page !== '...'" class="page-link" @click="changePage(page)">
                                {{ page }}
                            </button>
                            <span v-else class="page-link">...</span>
                        </li>
                        
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Footer (chỉ hiển thị ở mode dropdown) -->
            <div v-if="mode === 'dropdown'" class="notification-footer p-2 border-top text-center">
                <router-link to="/notifications" class="btn btn-link text-decoration-none small">
                    Xem tất cả thông báo
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
    mode: {
        type: String,
        default: 'dropdown', // 'dropdown' hoặc 'fullsize'
        validator: (value) => ['dropdown', 'fullsize'].includes(value)
    },
    title: {
        type: String,
        default: 'Thông báo'
    },
    width: {
        type: String,
        default: '400px'
    },
    height: {
        type: String,
        default: '500px'
    },
    maxHeight: {
        type: String,
        default: '500px'
    },
    itemsPerPage: {
        type: Number,
        default: 10
    }
})

// Reactive data
const isOpen = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const trigger = ref(null)
const dropdown = ref(null)

// Tabs configuration
const tabs = [
    { key: 'all', label: 'Tất Cả', hasNotification: true },
    { key: 'order', label: 'Đơn Hàng', hasNotification: true },
    { key: 'promotion', label: 'Sự Kiện', hasNotification: false },
    { key: 'system', label: 'Mã Giảm Giá', hasNotification: false },
    { key: 'account', label: 'Xác Nhận', hasNotification: false }
]

// Fake notifications data
const notifications = ref([
    {
        id: 1,
        type: 'order_cancelled',
        title: 'Đơn hàng bị hủy do quá thời hạn thanh toán #103655302',
        message: 'Đơn hàng của bạn đã bị hủy do quá thời hạn thanh toán',
        time: '17:40 06/04/2025',
        isRead: false,
        category: 'order'
    },
    {
        id: 2,
        type: 'payment_reminder',
        title: 'Fahasa nhắc bạn!',
        message: 'Chỉ còn 26 phút sẽ hết hạn thanh toán đơn hàng 103655302. Thanh toán ngay!',
        time: '17:10 06/04/2025',
        isRead: false,
        category: 'order'
    },
    {
        id: 3,
        type: 'order_cancelled',
        title: 'ĐỔN HÀNG CỦA QUÝ KHÁCH ĐÃ BỊ HỦY',
        message: 'Đơn hàng 103655304 đã bị hủy. Hẹn gặp lại Quý khách trong các đơn hàng tiếp theo.',
        time: '16:47 06/04/2025',
        isRead: false,
        category: 'order'
    },
    {
        id: 4,
        type: 'order_cancelled',
        title: 'ĐỔN HÀNG CỦA QUÝ KHÁCH ĐÃ BỊ HỦY',
        message: 'Đơn hàng 103655306 đã bị hủy. Hẹn gặp lại Quý khách trong các đơn hàng tiếp theo.',
        time: '16:46 06/04/2025',
        isRead: false,
        category: 'order'
    },
    {
        id: 5,
        type: 'order_cancelled',
        title: 'ĐỔN HÀNG CỦA QUÝ KHÁCH ĐÃ BỊ HỦY',
        message: 'Đơn hàng 103640515 đã bị hủy. Hẹn gặp lại Quý khách trong các đơn hàng tiếp theo.',
        time: '22:25 12/03/2025',
        isRead: true,
        category: 'order'
    },
    {
        id: 6,
        type: 'order_cancelled',
        title: 'ĐỔN HÀNG CỦA QUÝ KHÁCH ĐÃ BỊ HỦY',
        message: 'Đơn hàng 103658057 đã bị hủy. Hẹn gặp lại Quý khách trong các đơn hàng tiếp theo.',
        time: '17:13 11/04/2025',
        isRead: true,
        category: 'order'
    },
    {
        id: 7,
        type: 'promotion',
        title: 'Flash Sale đặc biệt - Giảm đến 70%',
        message: 'Hàng ngàn cuốn sách hot đang được giảm giá sốc. Nhanh tay đặt hàng!',
        time: '10:00 25/06/2025',
        isRead: false,
        category: 'promotion'
    },
    {
        id: 8,
        type: 'voucher',
        title: 'Mã giảm giá 100.000đ cho đơn hàng từ 500.000đ',
        message: 'Sử dụng mã BOOK100 để được giảm 100.000đ cho đơn hàng từ 500.000đ. Có hiệu lực đến 30/06/2025.',
        time: '08:30 25/06/2025',
        isRead: false,
        category: 'system'
    },
    {
        id: 9,
        type: 'order_confirmed',
        title: 'Đơn hàng #103655400 đã được xác nhận',
        message: 'Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị.',
        time: '14:20 24/06/2025',
        isRead: true,
        category: 'order'
    },
    {
        id: 10,
        type: 'account',
        title: 'Tài khoản của bạn đã được xác thực',
        message: 'Chúc mừng! Tài khoản BookStation của bạn đã được xác thực thành công.',
        time: '09:15 20/06/2025',
        isRead: true,
        category: 'account'
    }
])

// Computed properties
const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
})

const filteredNotifications = computed(() => {
    if (activeTab.value === 'all') {
        return notifications.value
    }
    return notifications.value.filter(n => n.category === activeTab.value)
})

const totalPages = computed(() => {
    if (props.mode === 'dropdown') return 1
    return Math.ceil(filteredNotifications.value.length / props.itemsPerPage)
})

const paginatedNotifications = computed(() => {
    if (props.mode === 'dropdown') {
        // Dropdown chỉ hiển thị 5 thông báo đầu tiên
        return filteredNotifications.value.slice(0, 5)
    }
    
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filteredNotifications.value.slice(start, end)
})

const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) {
                pages.push(i)
            }
            pages.push('...')
            pages.push(total)
        } else if (current >= total - 3) {
            pages.push(1)
            pages.push('...')
            for (let i = total - 4; i <= total; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            pages.push('...')
            for (let i = current - 1; i <= current + 1; i++) {
                pages.push(i)
            }
            pages.push('...')
            pages.push(total)
        }
    }
    
    return pages
})

const shouldShowPanel = computed(() => {
    return props.mode === 'fullsize' || isOpen.value
})

const componentClasses = computed(() => ({
    'notification-dropdown': props.mode === 'dropdown',
    'notification-fullsize': props.mode === 'fullsize'
}))

const panelClasses = computed(() => ({
    'position-absolute': props.mode === 'dropdown',
    'position-relative': props.mode === 'fullsize',
    'shadow': props.mode === 'dropdown'
}))

const titleClass = computed(() => ({
    'fs-6': props.mode === 'dropdown',
    'fs-4': props.mode === 'fullsize'
}))

const contentStyle = computed(() => {
    if (props.mode === 'dropdown') {
        return {
            maxHeight: '350px',
            overflowY: 'auto'
        }
    }
    return {
        height: props.height,
        maxHeight: props.maxHeight,
        overflowY: 'auto'
    }
})

// Methods
const toggleDropdown = () => {
    if (props.mode === 'dropdown') {
        isOpen.value = !isOpen.value
    }
}

const setActiveTab = (tab) => {
    activeTab.value = tab
    currentPage.value = 1
}

const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
        notification.isRead = true
    }
}

const markAllAsRead = () => {
    filteredNotifications.value.forEach(n => n.isRead = true)
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const getNotificationIcon = (type) => {
    const icons = {
        order_cancelled: 'bi-bag-x text-white',
        order_confirmed: 'bi-bag-check text-white',
        payment_reminder: 'bi-clock text-white',
        promotion: 'bi-tag text-white',
        voucher: 'bi-ticket-perforated text-white',
        system: 'bi-info-circle text-white',
        account: 'bi-person-check text-white'
    }
    return icons[type] || 'bi-bell text-white'
}

const getIconBgClass = (type) => {
    const classes = {
        order_cancelled: 'bg-warning',
        order_confirmed: 'bg-success',
        payment_reminder: 'bg-info',
        promotion: 'bg-primary',
        voucher: 'bg-danger',
        system: 'bg-secondary',
        account: 'bg-success'
    }
    return classes[type] || 'bg-muted'
}

const getTitleClass = (type) => {
    const classes = {
        order_cancelled: 'text-warning',
        order_confirmed: 'text-success',
        payment_reminder: 'text-info',
        promotion: 'text-primary',
        voucher: 'text-danger',
        system: 'text-secondary',
        account: 'text-success'
    }
    return classes[type] || 'text-dark'
}

const getCategoryBadgeClass = (category) => {
    const classes = {
        order: 'bg-warning text-dark',
        promotion: 'bg-primary text-white',
        system: 'bg-secondary text-white',
        account: 'bg-success text-white'
    }
    return classes[category] || 'bg-light text-dark'
}

const getCategoryLabel = (category) => {
    const labels = {
        order: 'Đơn hàng',
        promotion: 'Khuyến mãi',
        system: 'Hệ thống',
        account: 'Tài khoản'
    }
    return labels[category] || category
}

// Click outside to close (chỉ cho dropdown)
const handleClickOutside = (event) => {
    if (props.mode === 'dropdown' && trigger.value && dropdown.value && 
        !trigger.value.contains(event.target) && 
        !dropdown.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    if (props.mode === 'dropdown') {
        document.addEventListener('click', handleClickOutside)
    }
})

onUnmounted(() => {
    if (props.mode === 'dropdown') {
        document.removeEventListener('click', handleClickOutside)
    }
})
</script>

<style scoped>
/* Component container */
.notification-component {
    position: relative;
}

.notification-dropdown {
    position: relative;
}

.notification-fullsize {
    width: 100%;
    height: 100%;
}

/* Trigger (bell icon) */
.notification-trigger {
    cursor: pointer;
    transition: all 0.2s ease;
}

.notification-trigger:hover {
    opacity: 0.8;
}

/* Panel */
.notification-panel {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
    z-index: 1050;
}

/* Dropdown specific styles */
.notification-dropdown .notification-panel {
    top: 100%;
    right: 0;
    width: v-bind(width);
    max-height: v-bind(maxHeight);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Fullsize specific styles */
.notification-fullsize .notification-panel {
    width: 100%;
    box-shadow: none;
    border: 1px solid #dee2e6;
}

/* Header */
.notification-header {
    background: white;
}

/* Tabs */
.notification-tabs {
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.tab-btn {
    position: relative;
    font-size: 12px;
    color: #6c757d;
    transition: all 0.2s ease;
}

.tab-btn:hover {
    background-color: #e9ecef;
}

.tab-btn.active {
    background-color: white;
    color: #dc3545;
    font-weight: 600;
    border-bottom: 2px solid #dc3545;
}

.notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    background-color: #dc3545;
    border-radius: 50%;
}

/* Content */
.notification-content {
    background: white;
}

.notification-list {
    background: white;
}

.notification-item {
    cursor: pointer;
    transition: background-color 0.2s ease;
    background: white;
}

.notification-item:hover {
    background-color: #f8f9fa;
}

.notification-item.unread {
    background-color: #fff3cd;
}

.notification-icon {
    flex-shrink: 0;
}

.notification-title {
    font-size: 13px;
    line-height: 1.3;
}

.notification-message {
    font-size: 12px;
    line-height: 1.4;
}

.notification-time {
    font-size: 11px;
}

.unread-indicator {
    width: 8px;
    height: 8px;
    background-color: #dc3545;
    border-radius: 50%;
    flex-shrink: 0;
}

/* Footer */
.notification-footer {
    background: #f8f9fa;
}

/* Pagination */
.notification-pagination {
    background: #f8f9fa;
}

.page-link {
    color: #dc3545;
    border-color: #dee2e6;
}

.page-link:hover {
    color: #a71e2a;
    background-color: #f8f9fa;
    border-color: #dee2e6;
}

.page-item.active .page-link {
    background-color: #dc3545;
    border-color: #dc3545;
}

/* Scrollbar styling */
.notification-content::-webkit-scrollbar {
    width: 6px;
}

.notification-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.notification-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.notification-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Responsive */
@media (max-width: 576px) {
    .notification-dropdown .notification-panel {
        width: 350px;
        right: -150px;
    }
}
</style>
