
// One time data seeding for the database.
// Keep as a backup for a while.

const tag_groups = [
  {
    "clara":false
  },
  {
    "near":false,
    "midrange":false,
    "far":false
  },
  {
    "healthy":false,
    "meaty":false,
    "dessert":false,
  }
]

const foods_master_list = [
  {
    name: "kula",
    tags: [ "clara", "healthy"],
    active: true
  },
  {
    name: "thundercloud",
    tags: [ "clara", "near", "midrange"],
    active: true
  },
  {
    name: "curry kitchen",
    tags: [ "clara", "near"],
    active: true
  },
  {
    name: "indian cravings",
    tags: [ "clara", "midrange"],
    active: true
  },
  {
    name: "spicefine indian",
    tags: [ "clara", "near"],
    active: true
  },
  {
    name: "pho phong luu",
    tags: [ "clara", "near", "healthy"],
    active: true
  },
  {
    name: "bep saigon",
    tags: [ "clara", "near", "healthy"],
    active: true
  },
  {
    name: "broth and basil",
    tags: [ "clara", "midrange", "healthy"],
    active: true
  },
  {
    name: "inca chicken",
    tags: [ "clara", "midrange", "healthy"],
    active: true
  },
  {
    name: "kirby lane",
    tags: [ "clara", "midrange", "far"],
    active: true
  },
  {
    name: "hop doddys",
    tags: [ "clara", "midrange", "meaty"],
    active: true
  },
  {
    name: "hat creek",
    tags: [ "clara", "midrange", "meaty"],
    active: true
  },
  {
    name: "p terrys",
    tags: [ "clara", "near", "meaty"],
    active: true
  },
  {
    name: "gattis pizza",
    tags: [ "clara", "midrange"],
    active: true
  },
  {
    name: "marcos pizza",
    tags: [ "clara", "near"],
    active: true
  },
  {
    name: "pinthouse pizza",
    tags: [ "clara", "midrange"],
    active: true
  },
  {
    name: "torchys tacos",
    tags: [ "clara", "midrange", "meaty"],
    active: true
  },
  {
    name: "freddys",
    tags: [ "clara", "near", "meaty", "dessert"],
    active: true
  },
  {
    name: "culvers",
    tags: [ "clara", "midrange", "meaty"],
    active: true
  },
  {
    name: "in n out",
    tags: [ "clara", "midrange", "meaty"],
    active: true
  },
  {
    name: "blue corn",
    tags: [ "clara", "far"],
    active: true
  },
  {
    name:"top golf", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"rice bowl", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"sip saam", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"tofu house charm", 
    tags:["near","meaty"],
    active: true,
  },
  {
    name:"sunflower", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"pecan street", 
    tags:["near"],
    active: true,
  },
  {
    name:"fogonero", 
    tags:["near","healthy"],
    active: true,
  },
  {
    name:"pf taco house", 
    tags:["near","meaty"],
    active: true,
  },
  {
    name:"la casita", 
    tags:["near","meaty"],
    active: true,
  },
  {
    name:"magnolia", 
    tags:["far"],
    active: true,
  },
  {
    name:"gueros", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"little olas", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"odaku ", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"snow ball", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"bbq chicken", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"bamboo house", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"beijing noodle", 
    tags:["far"],
    active: true,
  },
  {
    name:"garbos", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"la madaleine", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"brasas peru", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"perla", 
    tags:["far","healthy"],
    active: true,
  },
  {
    name:"aba", 
    tags:["far","healthy"],
    active: true,
  },
  {
    name:"vic and als", 
    tags:["far"],
    active: true,
  },
  {
    name:"verbena", 
    tags:["far","healthy"],
    active: true,
  },
  {
    name:"local foods", 
    tags:["far","healthy"],
    active: true,
  },
  {
    name:"culinary dropout", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"velvet tacos", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"paris creperie", 
    tags:["midrange","dessert"],
    active: true,
  },
  {
    name:"jin", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"true food", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"flower child", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"2 in 1 salad", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"taverna domain", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"casa do brazil", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"ichiumu sushi", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"tatsumi sushi", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"qi dimsum", 
    tags:["far"],
    active: true,
  },
  {
    name:"las trancas tacos", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"baguette house", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"pho saigon", 
    tags:["midrange","healthy"],
    active: true,
  },
  {
    name:"three gorges", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"veracruz", 
    tags:["near","healthy"],
    active: true,
  },
  {
    name:"ohop", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"java cafe", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"nini sushi", 
    tags:["near","healthy"],
    active: true,
  },
  {
    name:"crab shack", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"roaring fork", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"broken egg", 
    tags:["far"],
    active: true,
  },
  {
    name:"wildfire", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"papis pies", 
    tags:["midrange","dessert"],
    active: true,
  },
  {
    name:"urban", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"pita shack", 
    tags:["near","healthy"],
    active: true,
  },
  {
    name:"which wich", 
    tags:["midrange"],
    active: true,
  },
  {
    name:"jimmy johns", 
    tags:["near"],
    active: true,
  },
  {
    name:"county line", 
    tags:["far"],
    active: true,
  },
  {
    name:"terry black", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"texas cafe", 
    tags:["far"],
    active: true,
  },
  {
    name:"h mart", 
    tags:["far"],
    active: true,
  },
  {
    name:"mala chili", 
    tags:["far"],
    active: true,
  },
  {
    name:"honey pig", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"little mamas", 
    tags:["midrange","meaty"],
    active: true,
  },
  {
    name:"the oasis", 
    tags:["far"],
    active: true,
  },
  {
    name:"blacks bbq", 
    tags:["far","meaty"],
    active: true,
  },
  {
    name:"foodheads", 
    tags:["far"],
    active: true,
  },
  {
    name:"gong c", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"ding tea", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"waffle love", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"andys ice cream", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"dairy queen", 
    tags:["dessert","near"],
    active: true,
  },
  {
    name:"rolli rolls", 
    tags:["dessert","near"],
    active: true,
  },
  {
    name:"krispy kream", 
    tags:["dessert","far"],
    active: true,
  },
  {
    name:"RR donuts", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"atx donut", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"beard papa", 
    tags:["dessert","midrange"],
    active: true,
  },
  {
    name:"nothing bundt", 
    tags:["dessert","midrange"],
    active: true,
  }
]


module.exports = {
  tag_groups,
  foods_master_list
}