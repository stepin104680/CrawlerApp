<template>
    <div class="container mt-3" >
        <div class="card">
            <div class="card-header">
                <h4>
                    Client Details
                    <RouterLink to="/clients/create" class="btn btn-primary float-end"> Add Client Details</RouterLink>
                </h4>
            </div>
            <div class="mt-2 ml-2">
                <span class="float-start" style="margin-right: 30px">Show:</span>
                <select v-model="perPage" class="float-start" style="margin-right: 30px; margin-bottom: 20px;">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="10">100</option>
                </select>
                <div class="float-end ml-3">
                    <span class="float-start" style="margin-right: 5px">Search By:</span>
                    <select v-model="searchType" style="margin-right: 30px;">
                        <option value="id">ID</option>
                        <option value="cin">CIN</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>
                    <input id="searchClient" v-model="searchText" placeholder="Search" @keyup.enter="searchClientDetails" style="margin-right: 5px;" />
                    <button class="btn btn-primary" style="margin-right: 5px;" @click="searchClientDetails">Search</button>
                    <button class="btn btn-primary" style="margin-right: 5px;" @click="clearSearchDetails">Clear</button>
                </div>
            </div>
            <div class="card-body" style="width:100%; overflow-x: scroll; max-width: 150%">
                <table class="table table-bordered" >
                    <thead>
                        <tr>
                            <th v-for="(fields,index) in tableHeaders" :key="index">
                                {{ fields }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="clientsData.length == 0">
                            <td :colspan="12">No Data available</td>
                        </tr>
                        <tr v-for="client in clientsData" :key="client.id">
                            <td>{{ client.id }}</td>
                            <td>{{ client.name }}</td>
                            <td>{{ client.status }}</td>
                            <td>{{ client.cin }}</td>
                            <td>{{ client.state }}</td>
                            <td>{{ client.country }}</td>
                            <td>{{ client.pin }}</td>
                            <td>{{ client.email }}</td>
                            <td>{{ client.category }}</td>
                            <td>{{ client.subcategory }}</td>
                            <td>{{ client.class }}</td>
                            <td>
                                <RouterLink :to='{path: "/clients/"+client.id+"/edit"}' class="btn btn-success float-end">Edit</RouterLink>
                                <button type="button" class="btn btn-danger float-end" @click="deleteClient(client.id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination mt-2" >
                    <div  style="font-size: bold;  text-align: center; margin-right: 30px;">Displaying from {{from}} to {{ to }}</div>
                    <button class="btn btn-primary float-start" :disabled="prevDisabled" @click="previousPage">Prev</button>
                    <span style="font-size: bold; width: 60px; text-align: center">{{ currentPage }} of {{ totalPages }}</span>
                    <button class="btn btn-primary float-start" :disabled="nextDisabled" @click="nextPage">Next</button>
            </div>
        </div>
        <modalView :modalText="modalText" :modalTitle="modalTitle" :showModal="isShowModal"></modalView>
    </div>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import axios from "axios";
import modalView from "./modalView.vue";
import slice from "lodash/slice"
let modalTitle = ref('')
let modalText = ref("")
let isShowModal = ref(false)
let perPage = ref(10)
let total = 0
let currentPage = 1
const clientsDataTotal = ref([])
const clientsData = ref([])
let prevDisabled = ref(true)
let nextDisabled = ref(true)
let from = 0
let to = 0
let searchType = ref("id")
let searchText = ref('')
let totalPages = ref(0)
let tableHeaders =["ID", "Company Name", "Status","CIN", "State", "Country", "PIN", "Email", "Category","Sub Category","Company Class","Actions"]

onMounted(()=>{
    getClientsDetails()
})

watch(()=>perPage.value,()=>{
    loadData()
})

function clearSearchDetails(){
    searchText.value = "";
    getClientsDetails()
}

function searchClientDetails(){
    axios.get(`http://localhost:3000/clients?${searchType.value}=${searchText.value}`).then(res=>{
        if(res.data){
            currentPage = 1;
            clientsDataTotal.value = res.data;
            total = res.data.length;
            loadData()
        }
    }).catch(err=>{
        isShowModal.value = true;
        modalTitle.value = "Error";
        modalText.value = err.response.data.error;
    })
}


function getClientsDetails(){
    axios.get('http://localhost:3000/clients').then(res=>{
        if(res.data){
            currentPage = 1;
            clientsDataTotal.value = res.data;
            total = res.data.length;
            loadData()
        }
    })
}

function deleteClient(id){
    axios.delete(`http://localhost:3000/clients/${id}`).then(res=>{
        console.log(res);
        isShowModal.value = true;
        if(res.status == 200){
            modalTitle.value = "Success Acknowledgement";
            modalText.value = "Successfully deleted client details";
            getClientsDetails()
        }else{
            modalTitle.value = "Failure Acknowledgement";
            modalText.value = "Error in deleting client details"
        }
    })
    .catch(err=>{
        isShowModal.value = true;
        modalTitle.value = "Error";
        modalText.value = err.response.data.error;
    })
}

function loadData(){
    let pagination = makePagination(total, perPage.value, currentPage)
    from = pagination.from;
    to = from -1 + parseInt(perPage.value)
    totalPages = pagination["last-page"]
    clientsData.value = slice(clientsDataTotal.value, from-1, to)
    if(total > 10 && currentPage != Math.ceil(total/perPage.value)){
        nextDisabled.value = false
    } else{
        nextDisabled.value = true
    }
    if(total > 10 && currentPage != 1){
        prevDisabled.value = false
    } else{
        prevDisabled.value = true
    }
}

function nextPage(){
    let lastPage = Math.ceil(total/perPage.value) || 0;
    if(currentPage <lastPage ){
        currentPage++;
        loadData()
    }
}

function previousPage(){
    if(currentPage > 1){
        currentPage--;
        loadData()
    }
}

function makePagination(totalInt=null, perPageInt=null, currentPageInt= null){
    total = total === null ? total: totalInt
    perPage.value = total === null ? perPage.value: perPageInt
    currentPage = total === null ? currentPage: currentPageInt
    if(total>0){
        let totalPages = Math.ceil(total/perPage.value)
        if(currentPage > totalPages){
            currentPage = 1;
        }
    }
    return{
        'total': total,
        "from": (currentPage -1)* perPage.value+1,
        'to': Math.min(currentPage * perPage.value, total),
        'last-page': Math.ceil(total/perPage.value) || 0
    }
}
</script>
  
<style>
th{
    font-weight: bold;
}

</style>
  