const REGISTERFORM = $("#registerForm");
const LOGINFORM = $("#loginForm");
getUserList();

REGISTERFORM.on("submit", (e) => {
  // pour empêcher que le formulaire ne soit envoyer et que la page ne se recharge.
  e.preventDefault();
  // récupérer les infos de l'user

  let pseudo = $("#pseudo").val();
  let firstname = $("#firstname").val();
  let lastname = $("#lastname").val();
  let password = $("#password").val();
  let action = $("#action").val();

  // appel de la fonction register
  register(pseudo, firstname, lastname, password, action);
});

LOGINFORM.on("submit", (e) => {
  // pour empêcher que le formulaire ne soit envoyer et que la page ne se recharge.
  e.preventDefault();
  // récupérer les infos de l'user

  let pseudo = $("#pseudo").val();
  let password = $("#password").val();
  let action = $("#action").val();

  // appel de la fonction login
  login(pseudo, password, action);
});

// la fonction register
function register(pseudo, firstName, lastName, passWord, action) {
  let data = {
    // la clé correspond à celle reprise dans le root.rest dans method POST. (cf: api_back)
    // et la valeur correspond  à celle  nommé dans la function register
    // la syntaxe suivante est un langage json, le PHP ne peut pas le comprendre
    pseudo: pseudo,
    password: passWord,
    firstname: firstName,
    lastname: lastName,
    action: action,
    // pour action, c'est aussi l'id mis dans le button
  };

  let dataOption = {
    method: "post",
    body: JSON.stringify(data),
    // pour que le format json soit compris par le langage php. Pour l'api puisse comprendre cette donnée
    // stringify() est une méthode qui appartient à la class JSON
  };

  // appel de la fonction fetch
  fetch("http://localhost/api_back/", dataOption)
    // fetch : une fonction asynchrone, elle retourne des promesses.

    // .then(response => {
    //     response.json()
    //     .then(data =>{
    //         console.log(data);
    //     })
    //     .catch(error => console.log("promesse non tenue..."));
    // }) // .then : dans le cas où la promesse est tenue

    // .catch(error => console.log("tu me l'avais promis en tout cas...")); // .catch : dans le cas où la promesse n'est pas tenue. Finir l'instruction avec un point virgule, uniquement après catch. Ces 3 ligne forment l'instruction.

    .then((response) => {
      // .then : dans le cas où la promesse est tenue
      response
        .json()
        .then((data) => {
          console.log(data);
        })
        .catch((er) => console.log("pas tenue hh"));
    })

    .catch((er) => console.log("pas tenue")); // .catch : dans le cas où la promesse n'est pas tenue. Finir l'instruction avec un point virgule, uniquement après catch. Ces 3 ligne forment l'instruction.
}

// la fonction login
function login(pseudo, passWord, action) {
  let data = {
    pseudo: pseudo,
    password: passWord,
    action: action,
  };

  let dataOption = {
    method: "post",
    body: JSON.stringify(data),
  };

  // appel de la fonction fetch
  fetch("http://localhost/api_back/", dataOption)
    .then((response) => {
      response
        .json()
        .then((donnee) => {
          console.log(donnee);
          // on enregistre l'identifiant et le prénom de l'utilisateur dans le localStorage (cf: cookie et session)
          localStorage.setItem("iduser", donnee.userInfo.id_user);

          localStorage.setItem("fistname", donnee.userInfo.fistname);
          window.location.href = "index.html";
        })
        .catch((error) => error);
    })

    .catch((error) => console.log("il y a une erreur"));
  // .catch : dans le cas où la promesse n'est pas tenue. Finir l'instruction avec un point virgule, uniquement après catch. Ces 3 ligne forment l'instruction.
}

// fonction pour obtenir la liste des utilisateurs
function getUserList() {
  fetch("http://localhost/api_back/getuserlist/")
    .then((response) => {
      response
        .json()
        .then((data) => {
          // console.log(data);
          // appel de printUsers
          printUsers(data.users);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

// fonction pour afficher la liste des user
function printUsers(listUser) {
  listUser.forEach((element) => {
    // creer une balise p en lui ajoutant le prenom de l'utilisateur comme texte
    let p = document.createElement("p");
    p.textContent = element.firstname;
    p.id = element.id_user;

    p.addEventListener("click", () => {
      getListMessage(localStorage.getItem("iduser"), p.id);
    })
    // on ajoute le paragraphe comme enfant de la div avec la class user_list
    $("#user_list").append(p);
  });
}

// fonction pour avoir la liste des message entre deux utilisateurs getListMessage
function getListMessage(expeditor, receiver) {
  fetch(
    "http://localhost/api_back/getListMessage/" +
      expeditor +
      "/" +
      receiver +
      "/"
  )
    .then((response) => {
      response
        .json()
        .then((data) => {
          // traitement
          console.log(data);
          printMessages(data.listMessage);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

// fonction pour afficher la liste des messages entre 2 users
function printMessages(ListMessage) {
  ListMessage.forEach((element) => {
    $("#discution").innerHTML = "";
    //  on crée une div et un paragraphe
    let div = document.createElement("div");
    let p = document.createElement("p");

    // on ajoute le paragraphe dans la div
    div.append(p);

    // on ajoute le texte dans le paragraphe
    p.textContent = element.message;

    if (element.expeditor_id == localStorage.getItem("iduser")) {
      div.className = "expediteur";
    } else {
      div.className = "recepteur";
    }
    $("#discution").append(div);
  });
}
