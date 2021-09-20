<script>
export default {
  created() {
    document.body.classList.remove("auth-body-bg");
  }
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="/" class="text-white">
        <i class="mdi mdi-home-variant h2 text-primary"></i>
      </a>
    </div>
    <div class="my-1 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="text-left">

              <div class="text-center mb-5 mt-5">
                <h3>Tentang IMPULSE</h3>
                <p class="mt-3"> Information systeM for PracticUm and Laboratory courSE (IMPULSE). <br> Merupakan website yang berfungsi untuk mengelola penjadwalan,
                monitoring dan pelaksanaan praktikum, sesuai dengan dengan kebutuhan praktikan,
                asisten, laboran, Kaur. Lab dan pihak Fakultas Informatika, Telkom University.
                Aplikasi ini diharapkan dapat mendukung pelaksanaan kegiatan operasional di
                Laboratorium Informatika (IFLAB).</p>
              </div>

              <b-tabs nav-class="nav-tabs-custom1">

                <b-tab title-link-class="p-3">
                  <template v-slot:title>
                    <a class="font-weight-bold active text-reset">Penanggung Jawab</a>
                    </template>
                    <p class="m-4">- Aulia Arif Wardana (KAUR LAB)</p>
                </b-tab>
                
                <b-tab title-link-class="p-3">
                  <template v-slot:title>
                    <a class="font-weight-bold active text-reset">Mentor</a>
                  </template>
                    <p class="m-4">- Oku Dewi Noviyantika Putri</p>
                    <p class="m-4">- Surya Mahadi</p>
                    <p class="m-4">- Aditya Eka Bagaskara</p>
                </b-tab>

                <b-tab title-link-class="p-3">
                  <template v-slot:title>
                    <a class="font-weight-bold active text-reset">Programmer</a>
                  </template>
                    <p class="m-4">- Dani Andhika Permana (Frontend) </p>
                    <p class="m-4">- Edgar Vigo (Frontend) </p>
                    <p class="m-4">- Muhammad Figo Akbar (Frontend) </p>
                    <p class="m-4">- Fariz Muhammad Rizky (Backend) </p>
                    <p class="m-4">- Indra Wahyudi (Backend) </p>
                    <p class="m-4">- Muhammad Hafidh Raditya (Backend) </p>
                </b-tab>
                
                <b-tab title-link-class="p-3">
                  <template v-slot:title>
                    <a class="font-weight-bold active text-reset">Network Administrator</a>
                  </template>
                    <p class="m-4">- Sya Raihan Heggi </p>
                </b-tab>
                
                <b-tab title-link-class="p-3">
                  <template v-slot:title>
                    <a class="font-weight-bold active text-reset">Quality Assurance</a>
                  </template>
                  <p class="m-4">- Hafshah Haudli Windjatika </p>
                  <p class="m-4">- Putri Ester Sumolang  </p>
                  <p class="m-4">- Saskia Putri Ananda </p>
                </b-tab>
              </b-tabs> 

              <div class="text-center">
                <h3 class="mt-5">IMPULSE dalam naungan</h3>
              </div>

              <div class="row row-no-gutters justify-content-center text-center p-4">
                  <div class="col-md-3 px-0 pr-2 pl-2" style="height:75%;">
                      <a href="https://informatics.labs.telkomuniversity.ac.id/">
                        <img class="img-fluid d-inline-flex align-items-center" src="@/assets/logo-lab-2.png" alt="">
                      </a>
                  </div>
                  <div class="col-md-3 px-0 pr-2 pl-2 text-center" style="height:75%;">
                      <a href="https://bif.telkomuniversity.ac.id/">
                        <img class="img-fluid d-inline-flex align-items-center" src="@/assets/logo-fakultas.png" alt="">
                      </a>
                  </div>
                  <div class="col-md-3 px-0 pr-2 pl-2" style="height:75%;">
                      <a href="https://telkomuniversity.ac.id/">
                        <img class="img-fluid d-inline-flex align-items-center" src="@/assets/logo-telkom.png" alt="">
                      </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <p> © 2021 Informatics Lab.</p>
    </div>
  </div>
  
</template>