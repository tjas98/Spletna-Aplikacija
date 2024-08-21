const mongoose = require('mongoose');




var PodatkiUrnikaSchema = new mongoose.Schema({
    stUr: Number,
    steviloOdmorov: Number,
    zacetekUre: Array,
    zacetekOdmor: Array,
    konecUre: Array,
    konecOdmor: Array,
    ure: Array
}, {
    collection: 'podatki'
})





var AdminSchema = new mongoose.Schema({
    mail: String
})

var DatumSchema = new mongoose.Schema({
    datum: String,
    predmeti: Object,
    profesorji: Object,
    urnikZaProf: Object
}, {
    collection: "Shranjen"
}) 


var PotrjenSchema = new mongoose.Schema({
    datum: String,
    predmeti: Object,
    profesorji: Object,
    urnikZaProf: Object,
    zadnjaSprememba: String
}, {
    collection: 'Potrjen'
}) 

var StalenSchema = new mongoose.Schema({
    predmeti: Object,
    profesorji: Object,
    urnikZaProf: Object
}, {
    collection: 'Stalen'
}) 

var ProfRabi = new mongoose.Schema({
    profesor: String
}, {
    collection: 'Kdo_rabi'
}) 

var NotificaProfesorSchema = new mongoose.Schema({
    profesor: String,
    sub: Object
}, {
    collection: "Push_data_prof"
})

var NotificaRazredSchema = new mongoose.Schema({
    razred: String,
    sub: Object,
    endpoint: String
}, {
    collection: "Push_data_raz"
})

var ProfesorjiSchema = new mongoose.Schema({
    ime: String,
    mail: String
}, {
    collection: "Profesorji"
})

var RazredSchema = new mongoose.Schema({
    razred: String
}, {
    collection: "Razredi"
})




const Admin = mongoose.model('admin', AdminSchema)
const Datum = mongoose.model('datum', DatumSchema);
const Potrjen = mongoose.model('potrjen', PotrjenSchema);
const KdoRabi = mongoose.model('kdorabi', ProfRabi);
const NotificaProfesor = mongoose.model('notificaP', NotificaProfesorSchema);
const NotificaRazred = mongoose.model('notificaR', NotificaRazredSchema);
const PodatkiUrnika = mongoose.model('podatki', PodatkiUrnikaSchema)
const Profesor = mongoose.model("Profesor", ProfesorjiSchema)
const Razred = mongoose.model("Razred", RazredSchema)
const Stalen = mongoose.model("Stalen", StalenSchema)


module.exports = {
    PodatkiUrnika,
    NotificaProfesor,
    NotificaRazred,
    Admin,
    Datum,
    Potrjen,
    KdoRabi,
    Profesor,
    Razred,
    Stalen
}