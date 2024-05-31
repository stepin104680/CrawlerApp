<template>
    <div class="container mt-5 mb-5">
        <div class="card">
            <div class="card-header">
                <h4>Update Client Details</h4>
            </div>
            <div class="card-body">
                <ul class="alert alert-warning" v-if="errorList.length > 0">
                    <li class="mb-0 ms-3" v-for="(error, index) in errorList" :key="index">
                    {{ error }}
                    </li>
                </ul>
                <div class="mb-3">
                    <label for="name">Company Name</label>
                    <input type="text" class="form-control" id="name" v-model="clientDetails.name">
                </div>
                <div class="mb-3">
                    <label for="name">Status</label>
                    <input type="text" class="form-control" id="status" v-model="clientDetails.status">
                </div>
                <div class="mb-3">
                    <label for="name">CIN</label>
                    <input type="text" class="form-control" id="cin" v-model="clientDetails.cin">
                </div>
                <div class="mb-3">
                    <label for="name">State</label>
                    <input type="text" class="form-control" id="state" v-model="clientDetails.state">
                </div>
                <div class="mb-3">
                    <label for="name">Country</label>
                    <input type="text" class="form-control" id="country" v-model="clientDetails.country">
                </div>
                <div class="mb-3">
                    <label for="name">PIN</label>
                    <input type="text" class="form-control" id="pin" v-model="clientDetails.pin">
                </div>
                <div class="mb-3">
                    <label for="name">Email</label>
                    <input type="email" class="form-control" id="email" v-model="clientDetails.email">
                </div>
                <div class="mb-3">
                    <label for="name">Category</label>
                    <input type="text" class="form-control" id="country" v-model="clientDetails.category">
                </div>
                <div class="mb-3">
                    <label for="name">Sub Category</label>
                    <input type="text" class="form-control" id="pin" v-model="clientDetails.subcategory">
                </div>
                <div class="mb-3">
                    <label for="name">Class</label>
                    <input type="email" class="form-control" id="email" v-model="clientDetails.class">
                </div>
                <div class="mb-3">
                    <button typr="button" class="btn btn-primary" @click="updateClient">Update</button>
                </div>
            </div>
        </div>
    </div>
    <modalView :modalText="modalText" :modalTitle="modalTitle" :showModal="isShowModal"></modalView>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import modalView from "./modalView.vue";
let clientDetails = ref({
    name: '',
    status: '',
    cin: '',
    state: "",
    country: '',
    pin: "",
    email: "",
    category: "",
    subcategory: "",
    class: ""
})

let modalTitle = ref('')
let modalText = ref("")
let isShowModal = ref(false)
let errorList = ref([]);
const useRouteParam = useRoute();

function closeModal(){
    document.getElementById("acknowledgmentModal").style.display="none";
}

function updateClient(){
    errorList.value = []
    if(clientDetails.value.name.length == 0){
        errorList.value.push("Name field is required")
    }else if(specialCharCheck(clientDetails.value.name)){
        errorList.value.push("Special characters are not allowed in Name")
    }
    if(clientDetails.value.status.length == 0){
        errorList.value.push("Status field is required")
    }else if(specialCharCheck(clientDetails.value.status)){
        errorList.value.push("Special characters are not allowed in status")
    }
    if(clientDetails.value.cin.length != 21){
        errorList.value.push("CIN should be exactly 21 digits")
    }else if(specialCharCheck(clientDetails.value.cin)){
        errorList.value.push("Special characters are not allowed in CIN")
    }
    if(clientDetails.value.pin.length != 6){
        errorList.value.push("PIN should be exactly 6 digits")
    }else if(specialCharCheck(clientDetails.value.pin)){
        errorList.value.push("Special characters are not allowed in PIN")
    }
    if(clientDetails.value.email.length == 0){
        errorList.value.push("Email field is required")
    }
    else if(!(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(clientDetails.value.email))){
        errorList.value.push("Enter Valid email id")
    }

    if(errorList.value.length === 0){
        axios.post(`http://localhost:3000/clients/${useRouteParam.params.id}`, clientDetails.value).then(res=>{
            isShowModal.value = true;
            if(res.status == 200){
                modalTitle.value = "Success Acknowledgement";
                modalText.value = "Successfully updated client details"
            }else{
                modalTitle.value = "Failure Acknowledgement";
                modalText.value = "Error in updating client details";
            }
        })
        .catch(err=>{
            isShowModal.value = true;
            modalTitle.value = "Error";
            modalText.value = err.response.data.error;
        })
    }
}

function getClientDetails(id){
    axios.get(`http://localhost:3000/clients/${useRouteParam.params.id}`).then(res=>{
        if(res.data){
            clientDetails.value = res.data[0];
        }
    })
    .catch(err=>{
        isShowModal.value = true;
        modalTitle.value = "Error";
        modalText.value = err.response.data.error;
    })
}

function specialCharCheck(value){
    var specialChar = "<>@!#$%^&*()+{}}?:;|'\"\\.,/~`-=";
    for(let i=0; i<specialChar.length; i++){
        if(value.indexOf(specialChar[i]) > -1){
            return true
        }
    }
    return false;
}

onMounted(()=>{
    getClientDetails()
})
</script>