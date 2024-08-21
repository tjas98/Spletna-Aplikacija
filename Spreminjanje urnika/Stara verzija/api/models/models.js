const mongoose = require('mongoose');




// 0 - Navaden urnik

var UrnikPredmetiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Predmeti'
})

var ProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Profesorji'
})

var UrnikProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Za_profesorja'
})

// 1 - Tedenski urnik

var TedenPredmetiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Teden_predmeti'
})

var TedenProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Teden_profesorji'
})



var TedenUrnikProfSchema = new mongoose.Schema({
    profesor: String,
    mail: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
  }, {
      versionKey: false,
      collection: "1 - Teden_za_profesorja"
});


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


// 2 - Potrjen urnik

var PrikazDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, {
    collection: '2 - Potrjen_predmeti'
})

var PrikazProfesorjiSchema = new mongoose.Schema({
    profesor: String,
    mail: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, {
    collection: '2 - Potrjen_za_profesorja'
})

var PrikazProfSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '2 - Potrjen_profesorji'
})

// 3 - Shranjen urnik

var ShranjenDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_predmeti'
})

var ShranjenProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_profeosrji'
})

var ShranjenZaProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_za_profesorja'
})

// 4 - Stalen urnik

var StalenDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Stalen_predmeti'
})

var StalenProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Stalen_profesorji'
})

var StalenZaProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Stalen_za_profesorja'
})

var PlacalSchema = new mongoose.Schema({
    mail: String

})

var MailSchema = new mongoose.Schema({
    profesor: String,
    mail: String
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
    urnikZaProf: Object
}, {
    collection: 'Potrjen'
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



const Mail = mongoose.model('mail', MailSchema)
const Admin = mongoose.model('admin', AdminSchema)
// Tedenski
//const TedenPredmeti = mongoose.model('stalenPredmeti', TedenPredmetiSchema);
//const TedenProfesorji = mongoose.model('stalenProfeosrji', TedenProfesorjiSchema);
//const TedenZaProfesorja = mongoose.model('', TedenUrnikProfSchema);

const Datum = mongoose.model('datum', DatumSchema);
const Potrjen = mongoose.model('potrjen', PotrjenSchema);

const KdoRabi = mongoose.model('kdorabi', ProfRabi);
const NotificaProfesor = mongoose.model('notificaP', NotificaProfesorSchema);
const NotificaRazred = mongoose.model('notificaR', NotificaRazredSchema);


// Spremenjljivi


const Profesorji = mongoose.model('profesorji', ProfesorjiSchema);
const UrnikPredmeti = mongoose.model('predmeti', UrnikPredmetiSchema);
const UrnikZaProfesorja = mongoose.model('urnikDijaki', UrnikProfesorjaSchema);

const PodatkiUrnika = mongoose.model('podatki', PodatkiUrnikaSchema)

//const PrikazDijaki = mongoose.model('PrikazDijaki', PrikazDijakiSchema);
//const PrikazProfesorji = mongoose.model('PrikazProfesorji', PrikazProfesorjiSchema)
//const PrikazProf = mongoose.model("PrikazMode", PrikazProfSchema)

//const ShranjenDijaki = mongoose.model('SpremembeDijaki', ShranjenDijakiSchema)
//const ShranjenProfesorji = mongoose.model(' SpremembeProfesorji', ShranjenProfesorjiSchema)
//const ShranjenZaProfesorja = mongoose.model('SpremembeZaProfesorja', ShranjenZaProfesorjaSchema)

const StalenPredmeti = mongoose.model('StalenStalenDijaki', StalenDijakiSchema)
const StalenProfesorji = mongoose.model(' StalenStalenProfeosorji', StalenProfesorjiSchema)
const StalenZaProfesorja = mongoose.model('StalenStalenZaProfesorja', StalenZaProfesorjaSchema)

const Placal = mongoose.model("Placal", PlacalSchema)


module.exports = {
    //TedenPredmeti,
    //TedenProfesorji,
    //ShranjenProfesorji,
    //ShranjenZaProfesorja,
    //TedenZaProfesorja,
    UrnikZaProfesorja,
    Profesorji,
    UrnikPredmeti,
    StalenProfesorji,
    StalenZaProfesorja,
    PodatkiUrnika,
    //PrikazProfesorji,
    //PrikazDijaki,
    //ShranjenDijaki,
    StalenProfesorji,
    StalenZaProfesorja,
    //PrikazProf,
    Mail,
    StalenPredmeti,
    NotificaProfesor,
    NotificaRazred,
    Placal,
    Admin,
    Datum,
    Potrjen,
    KdoRabi
}