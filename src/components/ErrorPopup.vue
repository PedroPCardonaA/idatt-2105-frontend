<script setup>
import '@/assets/css/errorPopup.css'
import { ref, onMounted } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    }
})

console.log(props.message)

// Delete the error popup after 10 seconds
setTimeout(() => {
    deleteSelf()
}, 6000)

function deleteSelf() {
    const errorPopup = document.querySelector('.error-popup')
    errorPopup.remove()
}

</script>

<template>
    <div class="error-popup">
        <div class="error-popup-content">
            <div class="error-popup-message">
                <p>{{ message }}</p>
            </div>
        </div>
    </div>
</template>