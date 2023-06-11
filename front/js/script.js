fetch("http://localhost:3000/api/products")
.then(reponse => reponse.json())
.then(kanap => {

    for(let i= 0; i<kanap.length; i++){
        const sectionItem = document.querySelector(".items");
        const article = kanap[i];

        const linkContainer = document.createElement("a");
        linkContainer.href = `./product.html?id=${article._id}`;

        const articleContainer = document.createElement("article");
        articleContainer.className.valueOf("items");

        const nomKanap = document.createElement("h3");
        nomKanap.innerText = article.name;
        const imgKanap = document.createElement("img");
        imgKanap.src = article.imageUrl;
        const descriptionKanap = document.createElement("p");
        if(article.description.length > 50){
            descriptionKanap.innerText = article.description.slice(0,50) + "...";
        } else {
            descriptionKanap.innerText = article.description;
        };

        articleContainer.appendChild(nomKanap);
        articleContainer.appendChild(imgKanap);
        articleContainer.appendChild(descriptionKanap);

        linkContainer.appendChild(articleContainer)
        sectionItem.appendChild(linkContainer);
    };
});