<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";

/**
 * Orders Component
 */
export default {
  components: {
    Layout,
    PageHeader,
    Multiselect
  },
  validations: {
    dataStudent: {
      name: { required },
      nim: { required },
      gender: { required },
      religion: { required }
    },
    kelas: { required }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "Student Data",
      dataStudent: { name: "", nim: "", gender: "", religion: "" },
      kelas: "",
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Student Data",
          active: true
        }
      ],
      ordersData: [
        {
          orderid: "#NZ1563",
          date: "28 Mar, 2020",
          billingname: "Frank Dean",
          total: "$164",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1564",
          date: "28 Mar, 2020",
          billingname: "Eddy Torres",
          total: "$141",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1565",
          date: "29 Mar, 2020",
          billingname: "Jamison Clark",
          total: "$123",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1566",
          date: "30 Mar, 2020",
          billingname: "Jewel Buckley",
          total: "$112",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1567",
          date: "31 Mar, 2020",
          billingname: "Jeffrey Waltz",
          total: "$105",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1568",
          date: "01 Apr, 2020",
          billingname: "Jefferson Allen",
          total: "$160",
          paymentstatus: "Chargeback"
        },
        {
          orderid: "#NZ1569",
          date: "02 Apr, 2020",
          billingname: "Paul Jones",
          total: "$183",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1570",
          date: "03 Apr, 2020",
          billingname: "Donald Bailey",
          total: "$146",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1571",
          date: "03 Apr, 2020",
          billingname: "Jimmy Barker",
          total: "$165",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1572",
          date: "04 Apr, 2020",
          billingname: "Walter Brown",
          total: "$172",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1573",
          date: "06 Apr, 2020",
          billingname: "James Hamilton",
          total: "$152",
          paymentstatus: "Paid"
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      fields: [
        { key: "orderid", sortable: true, label: "Order ID" },
        { key: "date", sortable: true },
        { key: "billingname", sortable: true, label: "Billing Name" },
        { key: "total", sortable: true, label: "Total" },
        { key: "paymentstatus", sortable: true, label: "Payment Status" },
        { key: "invoice" },
        { key: "action" }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.ordersData.length;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.ordersData.length;
  },
  methods: {
    ...notificationMethods,
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    
    inputStudent() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputStudent(this.dataStudent)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                
                    if (this.inputSuccess) {
                        console.log(response)
                        this.deleteForm();
                        Swal.fire("Submitted!", "The form submitted successfully.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    console.log(error.response)
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;
                })
          );
      }
    },

    cancelSubmit(){
        Swal.fire({
            title: "Are you sure?",
            text: "the form that you have filled in will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Yes, cancel it!"
        }).then(result => {
            if (result.value) {
                this.deleteForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Canceled!", "The form has been left blank.", "success");
            }
        });
    },

    deleteForm(){
        this.dataStudent.name = "";
        this.dataStudent.nim = "";
        this.dataStudent.gender = "";
        this.dataStudent.religion = "";
        this.kelas = "";
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">All Students</a>
                </template>
                <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
                  <!-- Search -->
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                      <label class="d-inline-flex align-items-center">
                        Search:
                        <b-form-input
                          v-model="filter"
                          type="search"
                          class="form-control form-control-sm ml-2"
                        ></b-form-input>
                      </label>
                    </div>
                  </div>
                  <!-- End search -->
                </div>
                <div class="table-responsive">
                  <b-table
                    class="table-centered"
                    :items="ordersData"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(paymentstatus)="row">
                      <div
                        class="badge font-size-12"
                        :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
                            'badge-soft-success': `${row.value}` === 'Paid',
                            'badge-soft-warning': `${row.value}` === 'Unpaid'}"
                      >{{ row.value}}</div>
                    </template>
                    <template v-slot:cell(invoice)>
                      <button class="btn btn-light btn-rounded">
                        Invoice
                        <i class="mdi mdi-download ml-2"></i>
                      </button>
                    </template>
                    <template v-slot:cell(action)>
                      <a
                        href="javascript:void(0);"
                        class="mr-3 text-primary"
                        v-b-tooltip.hover
                        title="Edit"
                      >
                        <i class="mdi mdi-pencil font-size-18"></i>
                      </a>
                      <a
                        href="javascript:void(0);"
                        class="text-danger"
                        v-b-tooltip.hover
                        title="Delete"
                      >
                        <i class="mdi mdi-trash-can font-size-18"></i>
                      </a>
                    </template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Input Student</a>
                </template>
                <div div class="row mt-4">
                <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputStudent">
                    <div title="Student Data">
                        <div class="tab-pane" id="metadata">
                            <h4 class="card-title">Student Data</h4>
                            <p class="card-title-desc">Fill all information below</p>
                            
                            <div>
                                <b-alert
                                v-model="inputSuccess"
                                class="mt-3"
                                variant="success"
                                dismissible
                                >Input data completed successfully!</b-alert>

                                <b-alert
                                v-model="isInputError"
                                class="mt-3"
                                variant="danger"
                                dismissible
                                >{{inputError}}</b-alert>

                                <b-alert
                                v-model="isInputCanceled"
                                class="mt-3"
                                variant="success"
                                dismissible
                                >Canceled!</b-alert>

                                <b-alert
                                variant="danger"
                                class="mt-3"
                                v-if="notification.message"
                                show
                                dismissible
                                >{{notification.message}}</b-alert>
                            </div>

                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="fullname">Full Name</label>
                                        <input 
                                        v-model="dataStudent.name"
                                        id="fullname" 
                                        name="fullname" 
                                        type="text" 
                                        class="form-control"
                                        :class="{ 'is-invalid': submitted && $v.dataStudent.name.$error }" />

                                        <div
                                        v-if="submitted && !$v.dataStudent.name.required"
                                        class="invalid-feedback"
                                        >Full Name is required.</div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="nim">NIM</label>
                                        <input
                                            v-model="dataStudent.nim"
                                            id="nim"
                                            name="nim"
                                            type="number"
                                            class="form-control"
                                            :class="{ 'is-invalid': submitted && $v.dataStudent.nim.$error }"
                                        />
                                        <div
                                        v-if="submitted && !$v.dataStudent.nim.required"
                                        class="invalid-feedback"
                                        >NIM is required.</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label for="kelasdefault">Class Default</label>
                                        <input
                                            v-model="kelas"
                                            id="kelasdefault"
                                            name="kelasdefault"
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': submitted && $v.kelas.$error }"
                                        />
                                        <div
                                        v-if="submitted && !$v.kelas.required"
                                        class="invalid-feedback"
                                        >Default Class is required.</div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                    <label class="control-label">Gender</label>
                                    <multiselect
                                        v-model="dataStudent.gender"
                                        :options="['Male', 'Female']"
                                        :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                                    ></multiselect>
                                        <div
                                        v-if="submitted && !$v.dataStudent.gender.required"
                                        class="invalid-feedback"
                                        >Gender is required.</div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                    <label class="control-label">Religion</label>
                                    <multiselect
                                        v-model="dataStudent.religion"
                                        :options="['Islam', 'Kristen', 'Katolik', 'Buddha', 'Hindu', 'Other']"
                                        :class="{ 'is-invalid': submitted && $v.dataStudent.religion.$error }" 
                                    ></multiselect>
                                        <div
                                        v-if="submitted && !$v.dataStudent.religion.required"
                                        class="invalid-feedback"
                                        >Religion is required.</div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                <button
                                type="submit"
                                class="btn btn-primary mr-2 waves-effect waves-light"
                                >Save Changes</button>
                                <button type="button" @click="cancelSubmit" class="btn btn-light waves-effect">Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>