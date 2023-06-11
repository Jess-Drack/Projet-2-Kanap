fetch("http://localhost:3000/api/products")
.then(reponse => reponse.json())
.then(kanap => {

    var str = window.location.href;
    var url = new URL(str);
    var id = url.searchParams.get("id");

    for(let i=0; i<kanap.length; i++){
        const article = kanap[i];
        let idKanap = article._id;

        if(id === idKanap){
            //console.log(localStorage.clear())

            const sectionImg = document.querySelector(".item__img");
            const imgKanap = document.createElement("img");
            imgKanap.src = article.imageUrl;
            sectionImg.appendChild(imgKanap);

            let titleKanap = document.getElementById("title");
            titleKanap.innerText = article.name;
            let priceKanap = document.getElementById("price");
            priceKanap.innerText = article.price;
            let descriptionKanap = document.getElementById("description");
            descriptionKanap.innerText = article.description;

            const couleur = article.colors;
            for(let i = 0; i < couleur.length; i++ ){
                const menuCouleur = document.querySelector("select");
                const nomCouleur = document.createElement("option");
                nomCouleur.innerText= couleur[i];
                nomCouleur.value=couleur[i];
                menuCouleur.appendChild(nomCouleur);

            };

            document.getElementById("addToCart").addEventListener("click", function(){
                const couleurChoisie = document.querySelector("select").value;
                let quantiteeChoisie = document.getElementById("quantity").value;
                quantiteeChoisie = parseInt(quantiteeChoisie)
                const commandeProduit = {id: idKanap,couleur: couleurChoisie,quantite: quantiteeChoisie};
                if(couleurChoisie != '' && quantiteeChoisie != 0 && quantiteeChoisie > 0 && quantiteeChoisie < 101){
                    const panier = JSON.parse(localStorage.getItem("panier")) || [];
                    let produitExisteDeja = false;
                    for(let i = 0; i < panier.length; i++){
                        if(commandeProduit.id == panier[i].id && commandeProduit.couleur == panier[i].couleur){
                            panier[i].quantite += quantiteeChoisie; 
                            produitExisteDeja = true;
                            break;
                        }
                    }
                    if(!produitExisteDeja){
                        panier.push(commandeProduit);
                    }
                    localStorage.setItem("panier", JSON.stringify(panier));
                    console.table(panier);
                }else{
                    alert('Erreur de saisie.')
                }
            });
        };
    };
});