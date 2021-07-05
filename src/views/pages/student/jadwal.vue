<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";

import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { calendarEvents, categories } from "./data-calendar";

/**
 * Calendar component
 */
export default {
  page: {
    title: "Jadwal Kalender ",
    meta: [{ name: "description" }],
  },
  components: { FullCalendar, Layout, PageHeader },
  data() {
    return {
      calendarEvents: calendarEvents,
      calendarOptions: {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "",
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
          listPlugin,
        ],
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        initialEvents: calendarEvents,
        editable: true,
        droppable: true,
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      currentEvents: [],
      showModal: false,
      eventModal: false,
      categories: categories,
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {
        title: "",
        category: "",
      },
      editevent: {
        editTitle: "",
        editcategory: "",
      },
    };
  },
  validations: {
    event: {
      title: { required },
      category: { required },
    },
  },
  methods: {
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        const title = this.event.title;
        const category = this.event.category;
        let calendarApi = this.newEventData.view.calendar;

        this.currentEvents = calendarApi.addEvent({
          id: this.newEventData.length + 1,
          title,
          start: this.newEventData.date,
          end: this.newEventData.date,
          classNames: [category],
        });
        this.showModal = false;
        this.newEventData = {};
      }
      this.submitted = false;
      this.event = {};
    },
    // eslint-disable-next-line no-unused-vars
    hideModal(e) {
      this.submitted = false;
      this.showModal = false;
      this.event = {};
    },
    /**
     * Edit event modal submit
     */
    // eslint-disable-next-line no-unused-vars
    editSubmit(e) {
      this.submit = true;
      const editTitle = this.editevent.editTitle;
      const editcategory = this.editevent.editcategory;

      this.edit.setProp("title", editTitle);
      this.edit.setProp("classNames", editcategory);
      this.successmsg();
      this.eventModal = false;
    },

    /**
     * Delete event
     */
    deleteEvent() {
      this.edit.remove();
      this.eventModal = false;
    },
    /**
     * Modal open for add event
     */
    dateClicked(info) {
      this.newEventData = info;
      this.showModal = true;
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      this.edit = info.event;
      this.editevent.editTitle = this.edit.title;
      this.editevent.editcategory = this.edit.classNames[0];
      this.eventModal = true;
    },

    closeModal() {
      this.eventModal = false;
    },

    confirm() {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to delete this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.deleteEvent();
          Swal.fire("Deleted!", "Event has been deleted.", "success");
        }
      });
    },

    /**
     * Show list of events
     */
    handleEvents(events) {
      this.currentEvents = events;
    },

    /**
     * Show successfull Save Dialog
     */
   
  },
};
</script>

                <template>
                  <Layout>
                    <PageHeader :title="title" :items="items" />
                      <div class="row ">
                      <div class="col-12">
                        <div class="card">
                          <div class="card-body">
                     
                              <div class="app-calendar" >
                              <FullCalendar
                                ref="fullCalendar"
                                :options="calendarOptions"
                              ></FullCalendar>
                            </div>
                            
                          </div>
                        </div>
                        
                      </div>
                    </div>
                                                    
                    <!-- Edit Modal -->
                    <b-modal
                      v-model="eventModal"
                      title="Kalender"
                      title-class="text-black font-18"
                      hide-footer
                      body-class="p-0"
                    >
                      <form @submit.prevent="editSubmit">
                        <div class="p-3">
                          <label>Mata Kuliah</label>
                          <div class="input-group m-b-15">
                            <input
                              v-model="editevent.editTitle"
                              class="form-control"
                              type="text"
                            />
                            <span class="input-group-append">
                              <button type="submit" class="btn btn-success btn-md">
                                <!-- <i class="fa "></i> Mulai Praktikum -->
                                <router-link
                                  tag="a"
                                  to="/praktikan/praktikum"
                                  class="font-weight-medium"
                                  href="javascript:void(0);"
                                  style="color: white;"
                                >Mulai Praktikum</router-link>
                              </button>
                            </span>
                          </div>
                        </div>
                        
                      </form>
                    </b-modal>
                  </Layout>
                </template>