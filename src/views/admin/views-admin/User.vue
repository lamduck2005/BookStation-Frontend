<template>
  <v-data-table
    :headers="headers"
    :items="users"
    class="elevation-1"
    :items-per-page="5"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn color="primary" @click="editUser(item)">Edit</v-btn>
      <v-btn color="error" @click="deleteUser(item.id)">Delete</v-btn>
    </template>

    <template v-slot:no-data>
      <v-alert type="info">No users found.</v-alert>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref } from "vue";

const headers = [
  { text: "ID", value: "id" },
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "Role", value: "role" },
  { text: "Actions", value: "actions", sortable: false },
];

const users = ref([]);

function editUser(user) {
  console.log("Edit", user);
}

function deleteUser(id) {
  console.log("Delete", id);
}
</script>
