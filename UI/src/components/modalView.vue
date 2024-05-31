<template>
    <div class="modal" id="acknowledgmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ modalText }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import {watch} from "vue";

const props = defineProps({
    modalTitle:{
        type: String
    },
    modalText:{
        type: String
    },
    showModal:{
        type: Boolean,
        default: false
    }

})

watch(()=>props.showModal,()=>{
    if(props.showModal == true){
        document.getElementById("acknowledgmentModal").style.display="block";
    }
})

function closeModal(){
    document.getElementById("acknowledgmentModal").style.display="none";
}


</script>