<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
  },
  validations: {
    dataEdit: {
      student_id: { required },
      class_id: { required },
    },
    dataEditDetail: {
      nim: { required },
      class_name: { required },
      course_name: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list students
      isFetchingData: false,
      dataStudents: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "nim",
      sortDesc: false,
      fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "class_name", sortable: true, label: "Kelas MK" },
        { key: "course_code", sortable: true, label: "Kode MK" },
        { key: "course_name", sortable: true, label: "Nama MK" },
        { key: "staff_code", sortable: true, label: "Kode Dosen" },
        { key: "semester", sortable: true, label: "Semester" },
        { key: "academic_year", sortable: true, label: "Tahun Akademik" },
        { key: "action", sortable: false }
      ],

      courseData: [],
      kelasData: [],
      namaKelasData: [],
      isKelasNotSelected: true,

      //v-model dropdown value = array of objects
      course_data: "",
      class_data: "",

      filter_course: "",
      filter_class: "",

      //edit data
      dataEdit: { 
          student_id: "",
          class_id: "",
          },
      dataEditDetail: { 
          nim: "",
          class_name: "",
          course_name: "",
          },
      submitted: false,
      isKelasEditNotSelected: true,
      course_dataEdit: "",
      class_dataEdit: "",

      //edit role
      roleData: ['asprak', 'aslab'],
      role_data: [],
      dataEditRole: {
          no_induk: "",
          student: 0,
          asprak: 0,
          aslab: 0,
          staff: 0,
          laboran: 0,
          dosen: 0,
      },
      main_role: "student",
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.totalRows;
    },
    datas() {
      return this.dataStudents;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    loadCourseData() {
        return this.courseData;
    }
  },
  mounted: async function() {
    // Set the initial number of items
    this.loading();
    await this.fetchData().then(result=>{
        this.loading();
    });

    this.loadDataDropdown();
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
    getRequestParams(search, kelas, course, page, pageSize, orderBy, sortDesc) {
      let params = {};

      if (search) {
        params["search"] = search;
      }

      if (kelas) {
        params["kelas"] = kelas;
      }

      if (course) {
        params["course"] = course;
      }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["per_page"] = pageSize;
      }

      if (orderBy) {
        params["orderBy"] = orderBy;
      }

      if (sortDesc) {
        params["sortedBy"] = "DESC";
      } else {
        params["sortedBy"] = "ASC";
      }

      return params;
    },
    fetchData(){
      this.loadDataDropdown();
      this.isFetchingData = true;

      let class_name = (this.class_data) ? this.class_data.name : "";
      let course_name = (this.course_data) ? this.course_data.name : "";

      const params = this.getRequestParams(
        this.filter,
        class_name,
        course_name,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllStudentClasses(params)
          .then(response => {
            this.isFetchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataStudents = response.data.data;
          })
          .catch(error => {
            this.isFetchingData = false;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
            })
          })
      )
    },

    async handlePageChange(value) {
      this.currentPage = value;
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async handlePageSizeChange(value) {
      this.perPage = value;
      this.currentPage = 1;
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async handleSortingChange(value){
      if(value.sortBy !== this.sortBy) {
        this.sortDesc = false
      } 
      else {
        if(this.sortDesc) {
          this.sortDesc = false
        } 
        else {
          this.sortDesc = true
        }
      }
      this.sortBy = value.sortBy;
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async handleSearch(value){
      this.filter = value;
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async refreshData(){
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    onClickDelete(data){
      Swal.fire({
          title: "Are you sure?",
          text: data.item.nim + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteStudent(data.item.student_id, data.item.nim);
          }
      });
    },

    deleteStudent(id, nim){
      return (
        api.deleteStudentClass(id)
          .then(response => {
            Swal.fire("Deleted!", nim + " has been deleted.", "success");
            this.loading();
            this.fetchData().then(result=>{
                this.loading();
            });
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: error
            })
          })
      )
    },

    loadDataDropdown(){
        this.getClassroomNames();
    },

    getClassroomNames(){
        return (
            api.getByNameClassrooms()
            .then(response => {
                if(response.data.classes){
                    this.namaKelasData = response.data.classes;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
            })
        )
    },

    async getDataClassrooms(namaKelasData){
        const params = this.getRequestParams(
                namaKelasData.name
        );
        return api.getListClassrooms(params)
            .then(response => {
                if (response.data.classes){
                    this.kelasData = response.data.classes;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
            })
    },

    async getDataCourses(kelasData){
        return new Promise((resolve, reject) => {
            kelasData.forEach((element, index, array) => {
                const params = this.getRequestParams(
                    element.course_id
                );
                this.getListCourses(params).then(()=>{
                  if (index === array.length -1) resolve();
                })
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
            })
        });
    },

    async getListCourses(params){
      return (
        api.getListCourses(params)
                    .then(response => {
                        if (response.data.courses){
                            this.courseData = response.data.courses
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer: error
                        })
                    })
      )
    },

    async setKelas(value){
        this.class_data = value;
        this.removeCourse();

        await this.getDataClassrooms(value);
        await this.getDataCourses(this.kelasData);

        this.isKelasNotSelected = false;
    },

    async setCourse(value){
        this.course_data = value;
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    removeKelas(){
        this.isKelasNotSelected = true;
        this.class_data = "";
        this.courseData = [];
        this.removeCourse();
    },

    async removeCourse(){
        this.course_data = "";
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async onClickEdit(data){
      //edit data
      this.dataEdit.student_id = data.item.student_id;
      this.dataEdit.class_id = data.item.class_id;
      this.dataEditDetail.nim = data.item.nim;
      await this.setKelasEdit(data.item);

      //edit role
      this.dataEditRole.no_induk = data.item.nim;
      this.getRoles(this.dataEditRole.no_induk);
      this.setRoles(this.role_data, this.dataEditRole);

      this.$bvModal.show('modal-edit');
    },

    setStudentClass(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.setStudentClass(this.dataEdit)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEditDetail.nim + " has been edited.", "success");
              this.loading();
              this.fetchData().then(result=>{
                  this.loading();
              });
            })
            .catch(error => {
              this.submitted = false;
              this.hideModal();

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
              })
            })
        )
      }
    },

    async setKelasEdit(value){
        this.dataEditDetail.class_name = value.name;
        this.removeCourseEdit();

        let data = {};
        data['name'] = value.class_name;

        await this.getDataClassrooms(data);
        await this.getDataCourses(this.kelasData)
          .then(() =>{
              let kelas = {};
              if (value.class_name){
                kelas = this.kelasData.find(data => data.name === value.class_name);
                let course = this.courseData.find(data => data.id === kelas.course_id);

                this.setCourseEdit(course);
              }
              else {
                kelas = this.kelasData.find(data => data.name === value.name);
              }
              this.class_dataEdit = kelas;
              this.dataEdit.class_id = kelas.id;

              this.isKelasEditNotSelected = false;
          })
    },

    async setCourseEdit(value){
        this.dataEditDetail.course_name = value.name;
        let data = this.courseData.find(data => data.id === value.id);
        this.course_dataEdit = data;
    },

    removeKelasEdit(){
        this.isKelasEditNotSelected = true;
        this.class_dataEdit = "";
        this.courseData = [];
        this.removeCourseEdit();
    },

    removeCourseEdit(){
        this.course_dataEdit = "";
    },

    getRoles(no_induk){
        return (
          api.getRoles(no_induk)
            .then(response => {
              if(response.data.data){
                  this.role_data = response.data.data.roles
              }
            })
            .catch(error => {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: error
              })
            })
        )
    },

    setRoles(role_data, dataEditRole){
        if (role_data.includes("student") == false){
            role_data.push("student");
        }
        role_data.forEach((element, index, array) => {
            if (element == "student") {
                dataEditRole.student = 1
            }
            if (element == "asprak") {
                dataEditRole.asprak = 1
            }
            if (element == "aslab") {
                dataEditRole.aslab = 1
            }
            if (element == "staff") {
                dataEditRole.staff = 1
            }
            if (element == "laboran") {
                dataEditRole.laboran = 1
            }
            if (element == "dosen") {
                dataEditRole.dosen = 1
            }
        });
    },

    editRole(){
        this.setRoles(this.role_data, this.dataEditRole);
        return (
          api.setRoles(this.dataEditRole)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEditRole.no_induk + " has been edited.", "success");
              this.loading();
              this.fetchData().then(result=>{
                  this.loading();
              });
            })
            .catch(error => {
              this.submitted = false;
              this.hideModal();
              
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
              })
            })
        )
    },

    removeRole(value){
        if (value == "student") {
            this.role_data.push("student");
        }
    },

    hideModal(){
      this.$bvModal.hide('modal-edit');
    },

    loading() {
      if(this.isLoading){
        this.isLoading = false;
      } else{
        this.isLoading = true;
      }

      var x = document.getElementById("loading");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },
  }
};
</script>

<template>
  <div>
    <div id="loading" style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <b-spinner style="width: 3rem; height: 3rem;" class="m-2" variant="warning" role="status"></b-spinner>
    </div>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-12">
        <label class="d-inline-flex align-items-center">
          Filter:
        </label>
      </div>
      <div class="row col-sm-12 col-md-12">
        <div class="col-sm-12 col-md-3">
          <div class="form-group">
            <multiselect
                placeholder="Kelas"
                v-model="class_data"
                :options="namaKelasData"
                label="name"
                track-by="name"
                @select="setKelas"
                @remove="removeKelas"
            ></multiselect>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <div class="form-group">
            <multiselect
                placeholder="Mata Kuliah"
                v-model="course_data"
                :options="loadCourseData"
                :disabled="isKelasNotSelected"
                label="name"
                track-by="name"
                @select="setCourse"
                @remove="removeCourse"
            ></multiselect>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-sm-12 col-md-6">
        <div id="tickets-table_length" class="dataTables_length">
          <label class="d-inline-flex align-items-center">
            Show&nbsp;
            <b-form-select 
            v-model="perPage" 
            size="sm" 
            :options="pageOptions"
            @change="handlePageSizeChange"
            ></b-form-select>&nbsp;entries
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
              @input="handleSearch"
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
        ref="table"
        class="table-centered"
        :items="datas"
        :fields="fields"
        responsive="sm"
        :per-page="0"
        :busy.sync="isFetchingData"
        :current-page="currentPage"
        @sort-changed="handleSortingChange"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
        :headVariant="'dark'"
      >
        <template v-slot:cell(action)="data">
          <a
            href="javascript:void(0);"
            @click=onClickEdit(data)
            class="mr-3 text-primary"
            v-b-tooltip.hover
            title="Edit"
          >
            <i class="mdi mdi-pencil font-size-18"></i>
          </a>
          <a
            href="javascript:void(0);"
            @click=onClickDelete(data)
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
            <b-pagination 
            v-model="currentPage" 
            :total-rows="rows" 
            :per-page="perPage"
            @input="handlePageChange"
            ></b-pagination>
          </ul>
        </div>
      </div>
    </div>
    <div name="modalEdit">
      <b-modal 
        size="lg" 
        id="modal-edit" 
        title="Edit Student" 
        hide-footer 
        title-class="font-18"
      >
        <div class="col-sm-12">
            <div class="form-group col-sm-12">
                <label for="nim">NIM</label>
                <input 
                style="background-color: #F0F4F6;"
                :disabled="true"
                v-model="dataEditDetail.nim"
                id="nip" 
                name="nip" 
                type="number" 
                class="form-control"/>
            </div>
        </div>
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editRole">
          <div class="tab-pane" id="metadata">
              <div class="col-sm-12">
                  <div class="form-group">
                      <label class="control-label">Roles</label>
                      <multiselect
                          v-model="role_data"
                          :options="roleData"
                          :multiple="true"
                          @remove="removeRole"
                      ></multiselect>
                  </div>
              </div>
              <div class="text-center mt-4">
                  <button
                  type="submit"
                  class="btn btn-primary mr-2 waves-effect waves-light"
                  >Save Changes</button>
                  <button type="button" @click="hideModal" class="btn btn-light waves-effect">Cancel</button>
              </div>
          </div>
        </form>
      </b-modal>
    </div>
  </div>
</template>