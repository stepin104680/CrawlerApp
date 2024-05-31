<template>
    <div class="container mt-5 mb-5">
        <div class="card">
            <div class="card-header">
                <h4>Add Client Details</h4>
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
                    <button typr="button" class="btn btn-primary" @click="saveClient()">Save</button>
                </div>
            </div>
        </div>
    </div>
    <modalView :modalText="modalText" :modalTitle="modalTitle" :showModal="isShowModal"></modalView>
</template>

<script setup>
import {ref} from "vue";
import axios from "axios";
import modalView from "./modalView.vue";
let clientDetails = {
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
}

let modalTitle = ref('')
let modalText = ref("")
let isShowModal = ref(false)
let errorList = ref([]);


function specialCharCheck(value){
    var specialChar = "<>@!#$%^&*()+{}}?:;|'\"\\.,/~`-=";
    for(let i=0; i<specialChar.length; i++){
        if(value.indexOf(specialChar[i]) > -1){
            return true
        }
    }
    return false;
}

function saveClient(){
    errorList.value = []
    if(clientDetails.name.length == 0){
        errorList.value.push("Name field is required")
    }else if(specialCharCheck(clientDetails.name)){
        errorList.value.push("Special characters are not allowed in Name")
    }
    if(clientDetails.status.length == 0){
        errorList.value.push("Status field is required")
    }else if(specialCharCheck(clientDetails.status)){
        errorList.value.push("Special characters are not allowed in status")
    }
    if(clientDetails.cin.length != 21){
        errorList.value.push("CIN should be exactly 21 digits")
    }else if(specialCharCheck(clientDetails.cin)){
        errorList.value.push("Special characters are not allowed in CIN")
    }
    if(clientDetails.pin.length != 6){
        errorList.value.push("PIN should be exactly 6 digits")
    }else if(specialCharCheck(clientDetails.pin)){
        errorList.value.push("Special characters are not allowed in PIN")
    }
    if(clientDetails.email.length == 0){
        errorList.value.push("Email field is required")
    }else if(!(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(clientDetails.email))){
        errorList.value.push("Enter Valid email id")
    }

    if(errorList.value.length === 0){
        axios.post('http://localhost:3000/clients', clientDetails).then(res=>{
            isShowModal.value = true;
            if(res.status == 200){
                modalTitle.value = "Success Acknowledgement";
                modalText.value = "Successfully added client details"
            }else{
                modalTitle.value = "Failure Acknowledgement";
                modalText.value = "Error in adding client details";
            }
            clientDetails = {
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
            } 
        })
        .catch(err=>{
            isShowModal.value = true;
            modalTitle.value = "Error";
            modalText.value = err.response.data.error;
        })
    }
}
</script>

<style scoped>
label{
    font-weight: bold;
}
</style>