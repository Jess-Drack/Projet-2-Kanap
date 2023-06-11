fetch("http://localhost:3000/api/products")
.then(reponse => reponse.json())
.then(kanap => {

    const panierString = localStorage.getItem("panier");
    const panier = JSON.parse(panierString);

    let qteTotal = 0;
    let prixTotal = 0;
    products= [];

    for(let i = 0; i < panier.length; i++){
        const produitDuPanier = panier[i];
        const idKanap = produitDuPanier.id;

        for(let i = 0; i < kanap.length; i++){
            if(idKanap === kanap[i]._id){

                const article = kanap[i];

                const sectionProduitPanier = document.getElementById("cart__items");
                const articleContainer = document.createElement("article");
                articleContainer.className = "cart__item";

                let divimg = document.createElement('div')
                divimg.className = 'cart__item__img';

                let divtext = document.createElement('div')
                divtext.className = 'cart__item__content';

                let divdesc = document.createElement('div')
                divdesc.className = 'cart__item__content__description';
                
                let divparametre = document.createElement('div');
                divparametre.className = 'cart__item__content__settings';

                let divquantite = document.createElement('div');
                divquantite.className= 'cart__item__content__settings__quantity';
                
                let divsupprime = document.createElement('div')
                divsupprime.className= 'cart__item__content__settings__delete';

                const imgKanap = document.createElement("img");
                imgKanap.src = article.imageUrl;
                const nomKanap = document.createElement("h2");
                nomKanap.innerText = article.name;
                const couleurKanap = document.createElement("p");
                couleurKanap.innerText = produitDuPanier.couleur;
                const prixKanap = document.createElement("p");
                prixKanap.innerText = article.price + " €";
                let quantiteKanap = document.createElement("input");
                quantiteKanap.setAttribute('type', 'number');
                quantiteKanap.className = 'itemQuantity';
                quantiteKanap.setAttribute('min', 1);
                quantiteKanap.setAttribute('max', 100);
                quantiteKanap.setAttribute('value', produitDuPanier.quantite);
                disableNumberInputKeyboard(quantiteKanap);
                const qte = document.createElement("p");
                qte.innerText = "Qté :";
                const supprimer = document.createElement("p");
                supprimer.className = "deleteItem";
                supprimer.innerText = "Supprimer";

                divimg.appendChild(imgKanap);

                divdesc.appendChild(nomKanap);
                divdesc.appendChild(couleurKanap);
                divdesc.appendChild(prixKanap);

                divquantite.appendChild(qte);
                divquantite.appendChild(quantiteKanap);
                divsupprime.appendChild(supprimer);
                divparametre.appendChild(divquantite);
                divparametre.appendChild(divsupprime);

                divtext.appendChild(divdesc);
                divtext.appendChild(divparametre);

                articleContainer.appendChild(divimg);
                articleContainer.appendChild(divtext);
                sectionProduitPanier.appendChild(articleContainer);

                qteTotal += produitDuPanier.quantite;
                prixTotal += article.price*produitDuPanier.quantite;
                products.push(produitDuPanier.id);

                const quantiteeElements = document.getElementsByClassName("itemQuantity");
                for(let y = 0; y < quantiteeElements.length; y++){
                    quantiteeElements[y].addEventListener("input", function(event){
                        quantiteKanap = parseInt(event.target.value)
                        let lastquantite = panier[y].quantite
                        panier[y].quantite = quantiteKanap;
                        if(lastquantite < panier[y].quantite){
                            qteTotal += 1;
                            const quantiteeTotaleFinal = document.getElementById("totalQuantity");
                            quantiteeTotaleFinal.innerText = qteTotal;
                            prixTotal += article.price;
                            const prixTotalFinal = document.getElementById("totalPrice");
                            prixTotalFinal.innerText = prixTotal; 
                        }else if(lastquantite > panier[y].quantite){
                            qteTotal -= 1;
                            const quantiteeTotaleFinal = document.getElementById("totalQuantity");
                            quantiteeTotaleFinal.innerText = qteTotal;
                            prixTotal -= article.price;
                            const prixTotalFinal = document.getElementById("totalPrice");
                            prixTotalFinal.innerText = prixTotal; 
                        }
                        localStorage.setItem("panier",JSON.stringify(panier));
                    });
                };

                const prixTotalFinal = document.getElementById("totalPrice");
                prixTotalFinal.innerText = prixTotal; 
                const quantiteeTotaleFinal = document.getElementById("totalQuantity");
                quantiteeTotaleFinal.innerText = qteTotal;

                supprimer.addEventListener("click", function(){
                    deleteItem();
                });
            };
        };
    };
    document.querySelector(".cart__order__form").addEventListener("submit", function(event){
        event.preventDefault();
        const Prenom = document.getElementById('firstName').value;
        const Nom = document.getElementById("lastName").value;
        const Adresse = document.getElementById("address").value;
        const Ville = document.getElementById("city").value;
        const Email = document.getElementById("email").value;

        if(rechercheNombre(Prenom) || rechercheNombre(Nom)){
            alert("L'un des champs n'est pas valide !"); //rip la fille d'Elon
            return;
        }

        if(!mailValide(Email)){
            alert("L'adresse mail n'est pas valide !");
            return;
        }

        const contact = {firstName: Prenom, lastName: Nom, address: Adresse, city: Ville, email: Email};

        fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            body: JSON.stringify({
                contact: contact,
                products: products
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                    },
            })
            .then(response => response.json())
            .then(data => {
            console.log('Data received:', data);
            // Utiliser les données renvoyées par le serveur ici
            localStorage.setItem("order", data.orderId);
            window.location.assign(`confirmation.html?orderId=${data.orderId}`);
            })
            .catch(error => {
            console.error('Error:', error);
            // Gérer les erreurs ici
            alert("Erreur lors de l'envoi de la requête");
            });
    });
});
//Cette fonction empêche de saisir la quantité au clavier, pour éviter tout problème de quantité négative
function disableNumberInputKeyboard(input) {
    input.addEventListener("keydown", function(e) {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
        e.preventDefault();
        }
    });
} 

function deleteItem() { 
    let deleteElement = panier.indexOf(produitDuPanier)
    panier.splice(deleteElement, 1)
    localStorage.setItem("panier",JSON.stringify(panier));
    articleContainer.remove();
    let deleteproduct = products.indexOf(produitDuPanier.id);
    products.splice(deleteproduct, 1);
};

//Cette fonction recherche si il y a un nombre dans la chaine de caractère
function rechercheNombre(string){
    return /\d/.test(string);
}

//Cette fonction recherche si l'adresse mail est valide
function mailValide(string){
    const regex = /\S+@\S+.\S+/;
    return regex.test(string);
}