const knex = require("../db/connection")

//lists all reservations ordered by time
function list() {
    //console.log("ALFONSO - SERVICE line 5 - list: ")
    return knex("reservations").select("*").orderBy("reservation_time")
    //console.log("ALFONSO - SERVICE line 7 - knexRes: ", knexRes);
    //return knexRes
}

// returns all reservations for a given date, where the status is not finished or cancelled, order by reservation time
// NOTHING SHOULD BE NULL
function listByDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({reservation_date})
        .whereNot({status:"finished"})//turn these off to see record
        .whereNot({status: "cancelled"})//turn these off to see record
        .orderBy("reservation_time")
}

//create new reservation 
function create(reservation) {
    return knex("reservations")
        .insert(reservation, "*")
        .then((res) => res[0])
}

// read specific reservation
function read(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first()
}

// update status of reservation matching the given reservation ID
function updateStatus(reservation_id, status) {
    //NOTE console.log("reservation_id",reservation_id)
    return knex("reservations")
        .where({reservation_id})
        .update({status})
        .then(() => read(reservation_id))
}

//search reservations by mobile number
function searchByPhone(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?", 
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

// update a reservation 
function update(updatedReservation) {
    //console.log("ALFONSO reservation.service - updatedReservation - line 52: ",updatedReservation)
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((res) => res[0])
}

module.exports = {
    list, 
    listByDate,
    create,
    read,
    updateStatus,
    searchByPhone,
    update,
}
