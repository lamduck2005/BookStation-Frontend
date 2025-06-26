<template>
    <div class="notification-dropdown">
        <!-- Notification Bell Icon -->
        <div class="notification-trigger d-flex flex-column align-items-center text-decoration-none text-dark position-relative" 
             @click="toggleDropdown" 
             ref="trigger">
            <i class="bi bi-bell fs-5"></i>
            <small class="text-muted" style="font-size: 11px;">Thông Báo</small>
            <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                  style="font-size: 9px;">{{ unreadCount }}</span>
        </div>

        <!-- Notification Dropdown -->
        <div v-if="isOpen" class="notification-panel position-absolute" ref="dropdown">
            <!-- Header của dropdown -->
            <div class="notification-header">
                <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 class="mb-0 fw-bold">Thông báo</h6>
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
            <div class="notification-content">
                <div v-if="filteredNotifications.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-bell-slash fs-1 text-muted"></i>
                    <p class="mt-2">Không có thông báo nào</p>
                </div>
                
                <div v-else class="notification-list">
                    <div 
                        v-for="notification in filteredNotifications" 
                        :key="notification.id"
                        class="notification-item p-3 border-bottom position-relative"
                        :class="{ 'unread': !notification.isRead }"
                        @click="markAsRead(notification.id)">
                        
                        <!-- Notification icon -->
                        <div class="d-flex">
                            <div class="notification-icon me-3">
                                <i class="bi" :class="getNotificationIcon(notification.type)"></i>
                            </div>
                            
                            <!-- Notification content -->
                            <div class="flex-grow-1">
                                <h6 class="notification-title mb-1 fw-bold" :class="getNotificationClass(notification.type)">
                                    {{ notification.title }}
                                </h6>
                                <p class="notification-message mb-1 text-muted small">
                                    {{ notification.message }}
                                </p>
                                <small class="notification-time text-muted">
                                    {{ notification.time }}
                                </small>
                            </div>
                            
                            <!-- Unread indicator -->
                            <div v-if="!notification.isRead" class="unread-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="notification-footer p-2 border-top text-center">
                <router-link to="/notifications" class="btn btn-link text-decoration-none small">
                    Xem tất cả thông báo
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Reactive data
const isOpen = ref(false)
const activeTab = ref('all')
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

// Methods
const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const setActiveTab = (tab) => {
    activeTab.value = tab
}

const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
        notification.isRead = true
    }
}

const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
}

const getNotificationIcon = (type) => {
    const icons = {
        order_cancelled: 'bi-bag-x text-warning',
        payment_reminder: 'bi-clock text-success',
        promotion: 'bi-tag text-primary',
        system: 'bi-info-circle text-info'
    }
    return icons[type] || 'bi-bell text-muted'
}

const getNotificationClass = (type) => {
    const classes = {
        order_cancelled: 'text-dark',
        payment_reminder: 'text-success',
        promotion: 'text-primary',
        system: 'text-info'
    }
    return classes[type] || 'text-dark'
}

// Click outside to close
const handleClickOutside = (event) => {
    if (trigger.value && dropdown.value && 
        !trigger.value.contains(event.target) && 
        !dropdown.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-dropdown {
    position: relative;
}

.notification-trigger {
    cursor: pointer;
    transition: all 0.2s ease;
}

.notification-trigger:hover {
    opacity: 0.8;
}

.notification-panel {
    top: 100%;
    right: 0;
    width: 400px;
    max-height: 500px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 1050;
    overflow: hidden;
}

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

.notification-content {
    max-height: 350px;
    overflow-y: auto;
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
    width: 40px;
    height: 40px;
    background-color: #f8f9fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    margin-top: 4px;
}

.notification-footer {
    background: #f8f9fa;
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
    .notification-panel {
        width: 350px;
        right: -150px;
    }
}
</style>
