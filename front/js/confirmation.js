// Récupère l'ID de commande stocker dans la page précédente, et l'affiche à sa place
const Order = localStorage.getItem("order");
const orderId = document.getElementById("orderId");
orderId.innerText = Order;

//Supression de tout ce qui a été stocké précedement
localStorage.clear();